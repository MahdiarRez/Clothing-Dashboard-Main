"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/button";
import BasicInfoSection from "@/components/basic-info-section";
import ImageUploadSection from "@/components/image-upload-section";
import SizesColorsQuantitySection from "@/components/sizes-colors-quantity-section";
import { addProduct, initDB } from "@/lib/db";
import type { Product, ProductImage, ProductVariant } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";
import AnimateContent from "@/components/ui2/animateContent";

export default function Page() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [images, setImages] = useState<ProductImage[]>([]);
	const [variants, setVariants] = useState<ProductVariant[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		initDB().catch((err) =>
			console.error("Failed to initialize DB on page load:", err),
		);
	}, []);

	const totalQuantity = useMemo(() => {
		return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
	}, [variants]);

	const validateForm = (): boolean => {
		if (!name.trim()) {
			toast({
				title: "Validation Error",
				description: "Product name is required.",
				variant: "destructive",
			});
			return false;
		}
		if (images.length === 0) {
			toast({
				title: "Validation Error",
				description: "At least one product image is required.",
				variant: "destructive",
			});
			return false;
		}
		if (!images.some((img) => img.isMain)) {
			if (images.length > 0) {
				setImages((prevImages) => {
					const updated = [...prevImages];
					updated[0].isMain = true;
					return updated;
				});
				toast({
					title: "Image Notice",
					description: "First image automatically set as main.",
					variant: "default",
				});
			} else {
				toast({
					title: "Validation Error",
					description: "Please select a main image.",
					variant: "destructive",
				});
				return false;
			}
		}
		if (variants.length === 0) {
			toast({
				title: "Validation Error",
				description: "At least one size/color variant is required.",
				variant: "destructive",
			});
			return false;
		}
		if (variants.some((v) => v.quantity <= 0)) {
			toast({
				title: "Validation Error",
				description: "All variant quantities must be greater than 0.",
				variant: "destructive",
			});
			return false;
		}
		return true;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		const newProduct: Product = {
			id: crypto.randomUUID(),
			name,
			description,
			images,
			variants,
			totalQuantity,
			createdAt: new Date().toISOString(),
		};

		try {
			await addProduct(newProduct);
			toast({ title: "Success", description: "Product created successfully!" });
			console.log("hi");
			setName("");
			setDescription("");
			setImages([]);
			setVariants([]);
			router.push("/products");
		} catch (error) {
			console.error("Failed to save product:", error);
			toast({
				title: "Error",
				description: "Failed to save product. See console for details.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6 pb-12 pt-20 relative">
			<div className="flex flex-col items-center gap-2 mb-9">
				<AnimateContent
					delay={0.3}
					direction="horizontal"
					reverse>
					<h1 className="text-3xl font-bold text-center flex flex-row items-center gap-2">
						Create New Product
						<Smile size={30} />
					</h1>
				</AnimateContent>
				<AnimateContent
					delay={0.7}
					direction="horizontal">
					<p className="text-base opacity-70">
						Craft exceptional fashion pieces that define{" "}
						<span className="text-yellow-600 font-medium text-base">
							luxury
						</span>{" "}
						and{" "}
						<span className="text-yellow-600 font-medium text-base">
							elegance
						</span>
					</p>
				</AnimateContent>
			</div>
			<form
				onSubmit={handleSubmit}
				className="space-y-6">
				<BasicInfoSection
					name={name}
					setName={setName}
					description={description}
					setDescription={setDescription}
				/>
				<ImageUploadSection
					images={images}
					setImages={setImages}
				/>
				<SizesColorsQuantitySection
					variants={variants}
					setVariants={setVariants}
					totalQuantity={totalQuantity}
				/>

				<div className="flex justify-end">
					<Button
						className="bg-white"
						type="submit">
						{isSubmitting ? "Submitting..." : "Submit Product"}
					</Button>
				</div>
			</form>
		</div>
	);
}
