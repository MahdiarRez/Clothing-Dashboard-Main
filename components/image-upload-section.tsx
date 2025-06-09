"use client";

import type React from "react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { X, CheckCircle, LucideCrop, Upload } from "lucide-react";
import type { ProductImage, ImageUploadProps } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import SectionCard from "./ui2/section-card";
import SectionHeader from "./ui2/section-header";
import SectionBody from "./ui2/section-body";
import { ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Helper to convert File to Base64 Data URL
const fileToDataUrl = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

// Helper to get cropped image
const getCroppedImg = (image: HTMLImageElement, crop: any): Promise<string> => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width,
		crop.height,
	);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				throw new Error("Canvas is empty");
			}
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.readAsDataURL(blob);
		}, "image/jpeg");
	});
};

// Grid pattern component for drag area
function GridPattern() {
	const columns = 20;
	const rows = 8;
	return (
		<div className="flex bg-gray-50 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: columns }).map((_, col) => {
					const index = row * columns + col;
					return (
						<div
							key={`${col}-${row}`}
							className={`w-8 h-8 flex shrink-0 rounded-[1px] ${
								index % 2 === 0
									? "bg-gray-100"
									: "bg-gray-100 shadow-[0px_0px_1px_1px_rgba(255,255,255,1)_inset]"
							}`}
						/>
					);
				}),
			)}
		</div>
	);
}

// Image crop dialog component
function ImageCropDialog({
	image,
	onCropComplete,
	children,
}: {
	image: ProductImage;
	onCropComplete: (croppedDataUrl: string) => void;
	children: React.ReactNode;
}) {
	const [crop, setCrop] = useState<any>();
	const [imgRef, setImgRef] = useState<HTMLImageElement>();
	const [isOpen, setIsOpen] = useState(false);

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		setImgRef(e.currentTarget);

		const crop = centerCrop(
			makeAspectCrop(
				{
					unit: "%",
					width: 90,
				},
				1,
				width,
				height,
			),
			width,
			height,
		);
		setCrop(crop);
	};

	const handleCropComplete = async () => {
		if (imgRef && crop) {
			try {
				const croppedImageUrl = await getCroppedImg(imgRef, crop);
				onCropComplete(croppedImageUrl);
				setIsOpen(false);
			} catch (error) {
				console.error("Error cropping image:", error);
			}
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex justify-center">
						<ReactCrop
							crop={crop}
							onChange={(c) => setCrop(c)}
							aspect={1}>
							<Image
								src={image.dataUrl || "/placeholder.svg"}
								alt="Crop preview"
								width={400}
								height={400}
								onLoad={onImageLoad}
								className="max-w-full h-auto"
							/>
						</ReactCrop>
					</div>
					<div className="flex justify-end gap-2">
						<Button onClick={() => setIsOpen(false)}>Cancel</Button>
						<Button onClick={handleCropComplete}>Apply Crop</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function ImageUploadSection({
	images,
	setImages,
}: ImageUploadProps) {
	const { toast } = useToast();
	const [isDragOver, setIsDragOver] = useState(false);

	const processFiles = async (files: File[]) => {
		const newImagesPromises = files.map(async (file) => {
			try {
				const dataUrl = await fileToDataUrl(file);
				return {
					id: crypto.randomUUID(),
					name: file.name,
					dataUrl,
					isMain: images.length === 0 && files.length === 1,
				} as ProductImage;
			} catch (error) {
				console.error("Error converting file to data URL:", error);
				toast({
					title: "Image Upload Error",
					description: `Could not process ${file.name}.`,
					variant: "destructive",
				});
				return null;
			}
		});

		const resolvedNewImages = (await Promise.all(newImagesPromises)).filter(
			(img) => img !== null,
		) as ProductImage[];

		if (
			images.length === 0 &&
			resolvedNewImages.length > 0 &&
			!resolvedNewImages.some((img) => img.isMain)
		) {
			resolvedNewImages[0].isMain = true;
		}

		setImages([...images, ...resolvedNewImages]);
	};

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files) return;
		await processFiles(Array.from(files));
	};

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setIsDragOver(false);
			await processFiles(acceptedFiles);
		},
		[images],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
		},
		multiple: true,
		noClick: true,
		onDragEnter: () => setIsDragOver(true),
		onDragLeave: () => setIsDragOver(false),
	});

	const removeImage = (id: string) => {
		const remainingImages = images.filter((img) => img.id !== id);
		if (
			images.find((img) => img.id === id)?.isMain &&
			remainingImages.length > 0
		) {
			if (!remainingImages.some((img) => img.isMain)) {
				remainingImages[0].isMain = true;
			}
		}
		setImages(remainingImages);
	};

	const setMainImage = (id: string) => {
		setImages(images.map((img) => ({ ...img, isMain: img.id === id })));
	};

	const updateImageAfterCrop = (id: string, croppedDataUrl: string) => {
		setImages(
			images.map((img) =>
				img.id === id ? { ...img, dataUrl: croppedDataUrl } : img,
			),
		);
	};

	return (
		<SectionCard>
			<SectionHeader>
				<ImageIcon /> Product Images
			</SectionHeader>
			<SectionBody>
				{/* Enhanced Drag & Drop Upload Area */}
				<div
					{...getRootProps()}
					className="relative">
					<motion.div
						className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
              ${
								isDragActive || isDragOver
									? "border-primary bg-primary/5 scale-[1.02]"
									: "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
							}
            `}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}>
						<input {...getInputProps()} />
						<Input
							id="imageUpload"
							type="file"
							multiple
							accept="image/*"
							onChange={handleImageUpload}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>

						{/* Grid Pattern Background */}
						<div className="absolute inset-0 overflow-hidden rounded-xl opacity-30">
							<GridPattern />
						</div>

						<div className="relative z-10 space-y-4">
							<motion.div
								className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
								animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}>
								<Upload className="h-8 w-8 text-gray-600" />
							</motion.div>
							<div>
								<p className="text-lg font-medium text-gray-900">
									{isDragActive
										? "Drop your images here!"
										: "Upload Product Images"}
								</p>
								<p className="text-gray-500 text-sm mt-1">
									Drag & drop or click to select multiple images
								</p>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Image Gallery */}
				{images.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium text-gray-900">
								Gallery ({images.length})
							</h4>
							<span className="text-sm text-gray-500">
								Hover to edit • Click star to set main
							</span>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{images.map((image, index) => (
								<motion.div
									key={image.id}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.1 }}
									className="relative group border rounded-md overflow-hidden aspect-square">
									<Image
										src={image.dataUrl || "/placeholder.svg"}
										alt={image.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
									/>

									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-1">
										{/* Crop Button */}
										<ImageCropDialog
											image={image}
											onCropComplete={(croppedDataUrl) =>
												updateImageAfterCrop(image.id, croppedDataUrl)
											}>
											<Button className="h-7 w-7 bg-blue-500 hover:bg-blue-600">
												<LucideCrop className="h-4 w-4" />
											</Button>
										</ImageCropDialog>

										{/* Remove Button */}
										<Button
											className="h-7 w-7 bg-red-500 hover:bg-red-600"
											onClick={() => removeImage(image.id)}>
											<X className="h-4 w-4" />
										</Button>

										{/* Set Main Button */}
										<Button
											className={`h-7 px-2 text-xs ${
												image.isMain
													? "bg-yellow-500 hover:bg-yellow-600"
													: "bg-gray-500 hover:bg-gray-600"
											}`}
											onClick={() => setMainImage(image.id)}>
											{image.isMain ? (
												<CheckCircle className="h-4 w-4 mr-1" />
											) : null}
											{image.isMain ? "Main" : "Set Main"}
										</Button>
									</div>

									{/* Main Image Indicator */}
									{image.isMain && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="absolute top-1 right-1 bg-primary text-primary-foreground p-1 rounded-full"
											title="Main image">
											<CheckCircle className="h-4 w-4" />
										</motion.div>
									)}
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</SectionBody>
		</SectionCard>
	);
}
