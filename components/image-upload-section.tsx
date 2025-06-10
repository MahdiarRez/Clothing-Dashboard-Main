"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, Upload, Star, Image as ImageIcon, Crop } from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import type { ProductImage, ImageUploadProps } from "@/lib/types";
import SectionCard from "./ui2/section-card";
import SectionHeader from "./ui2/section-header";
import Button from "./ui2/button";
import toast from "react-hot-toast";

// convert File - dataURL
const fileToDataUrl = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});

// drawImage helper expects pixel-based crop
const getCroppedImg = (
	image: HTMLImageElement,
	crop: { x: number; y: number; width: number; height: number },
): Promise<string> => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No 2d context");

	// factor from displayed size - natural size
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		crop.width,
		crop.height,
	);

	return new Promise((resolve) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) throw new Error("Canvas is empty");
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			},
			"image/jpeg",
			0.9,
		);
	});
};

export default function ImageUploadSection({
	images,
	setImages,
}: ImageUploadProps) {
	const [croppingImage, setCroppingImage] = useState<ProductImage | null>(null);
	const [crop, setCrop] = useState<any>();
	const imgRef = useRef<HTMLImageElement>(null);

	const processFiles = async (files: File[]) => {
		const newImgs = await Promise.all(
			files.map(async (file) => {
				try {
					const dataUrl = await fileToDataUrl(file);
					return {
						id: crypto.randomUUID(),
						name: file.name,
						dataUrl,
						isMain: images.length === 0 && files.length === 1,
					} as ProductImage;
				} catch {
					toast.error(`Could not process ${file.name}.`);
					return null;
				}
			}),
		);
		const valid = newImgs.filter(Boolean) as ProductImage[];
		if (valid.length) setImages([...images, ...valid]);
	};

	const onDrop = useCallback(
		async (accepted: File[]) => {
			await processFiles(accepted);
		},
		[images, setImages],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
		multiple: true,
		noClick: true,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);
	const removeImage = (id: string) => {
		const remaining = images.filter((img) => img.id !== id);
		if (images.find((img) => img.id === id)?.isMain && remaining.length) {
			remaining[0].isMain = true;
		}
		setImages(remaining);
	};
	const setMainImage = (id: string) =>
		setImages(images.map((img) => ({ ...img, isMain: img.id === id })));

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		const initial = centerCrop(
			makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
			width,
			height,
		);
		setCrop(initial);
	};

	// Update to convert % - px right before drawing
	const handleCropComplete = async () => {
		if (!croppingImage || !crop || !imgRef.current) return;

		const imageEl = imgRef.current;
		const nW = imageEl.naturalWidth;
		const nH = imageEl.naturalHeight;
		const dW = imageEl.width;
		const dH = imageEl.height;
		const pxX = (crop.x / 100) * nW;
		const pxY = (crop.y / 100) * nH;
		const pxW = (crop.width / 100) * nW;
		const pxH = (crop.height / 100) * nH;

		try {
			const croppedDataUrl = await getCroppedImg(imageEl, {
				x: pxX,
				y: pxY,
				width: pxW,
				height: pxH,
			});
			setImages(
				images.map((img) =>
					img.id === croppingImage.id
						? { ...img, dataUrl: croppedDataUrl }
						: img,
				),
			);
			setCroppingImage(null);
			toast.success("The image has been successfully cropped.", {
				className: "min-w-fit",
			});
		} catch {
			toast.error("Could not crop the image.", {
				className: "min-w-fit",
			});
		}
	};

	return (
		<SectionCard className="overflow-hidden w-full h-full">
			<SectionHeader>
				<div className="p-1.5 rounded-md bg-Secondary/20">
					<ImageIcon className="text-Secondary" />
				</div>
				Product Images
			</SectionHeader>
			<div className="px-6 py-4 space-y-6">
				{/* Upload */}
				<div
					{...getRootProps()}
					onClick={() => fileInputRef.current?.click()}
					className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer group ${
						isDragActive
							? "border-black bg-gray-50"
							: "border-gray-300 hover:border-gray-400 hover:bg-gray-100/50"
					}`}>
					<input
						{...getInputProps()}
						ref={fileInputRef}
						className="hidden"
					/>
					<div className="space-y-4">
						<div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-200">
							<Upload
								size={32}
								className="text-gray-600"
							/>
						</div>
						<p className="text-lg font-medium text-gray-900">
							{isDragActive ? "Release to upload" : "Upload Images"}
						</p>
						<p className="text-gray-500 sm:text-sm mt-1">
							Drag & drop or click to select
						</p>
					</div>
				</div>

				{/* Gallery */}
				{images.length > 0 && (
					<div className="space-y-4">
						<div className="flex justify-between">
							<h4 className="font-medium text-gray-900">
								Gallery ({images.length})
							</h4>
							<span className="text-xs sm:text-sm text-gray-500">
								Hover to Crop • Click star to set main
							</span>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{images.map((img) => (
								<div
									key={img.id}
									className="relative group bg-white rounded-xl overflow-hidden aspect-square border border-gray-200 hover:shadow-lg">
									<Image
										src={img.dataUrl || "/placeholder.svg"}
										alt={img.name}
										fill
										className="object-cover transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center space-y-2 p-2">
										<Button
											className="bg-white text-xs min-w-20"
											onClick={() => setCroppingImage(img)}>
											<Crop size={16} /> Crop
										</Button>
										<Button
											onClick={() => removeImage(img.id)}
											className="bg-red-400 text-xs min-w-20">
											<X size={13} /> Trash
										</Button>
										<Button
											onClick={() => setMainImage(img.id)}
											className={`text-xs ${
												img.isMain
													? "bg-yellow-400 text-black"
													: "bg-white/90 text-black"
											}`}>
											<Star
												size={14}
												className={img.isMain ? "fill-current" : ""}
											/>{" "}
											Main
										</Button>
									</div>
									{img.isMain && (
										<div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 p-1.5 rounded-full">
											<Star
												size={16}
												className="fill-current"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Crop Modal */}
			{croppingImage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black bg-opacity-50"
						onClick={() => setCroppingImage(null)}
					/>
					<div className="relative bg-white rounded-xl shadow-2xl w-full mx-4 max-w-4xl max-h-[90vh] overflow-hidden">
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold text-center">
								Crop Your Image
							</h2>
							<Button
								onClick={() => setCroppingImage(null)}
								className="p-0  text-white bg-red-400 hover:text-gray-600">
								<X size={20} />
							</Button>
						</div>
						<div className="p-6 overflow-auto max-h-[calc(90vh-8rem)]">
							<div className="flex flex-col items-center space-y-4">
								<div className="w-full max-w-[500px] flex justify-center">
									<ReactCrop
										crop={crop}
										onChange={(_, percentCrop) => setCrop(percentCrop)}
										aspect={1}
										minWidth={100}
										minHeight={100}>
										<Image
											ref={imgRef}
											src={croppingImage.dataUrl || "/placeholder.svg"}
											alt="Crop preview"
											onLoad={onImageLoad}
											width={300}
											height={300}
											style={{ maxHeight: "60vh", maxWidth: "100%" }}
										/>
									</ReactCrop>
								</div>
								<div className="flex justify-end space-x-3 w-full pt-4">
									<Button
										className="bg-gray-300"
										onClick={() => setCroppingImage(null)}>
										Cancel
									</Button>
									<Button
										isActive
										onClick={handleCropComplete}>
										Apply Crop
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</SectionCard>
	);
}
