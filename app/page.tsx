"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/button";
import BasicInfoSection from "@/components/basic-info-section";
import ImageUploadSection from "@/components/image-upload-section";
import SizesColorsQuantitySection from "@/components/sizes-colors-quantity-section";
import { addProduct, initDB } from "@/lib/db";
import type { Product, ProductImage, ProductVariant } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Check, Smile } from "lucide-react";
import AnimateContent from "@/components/ui2/animateContent";
import toast from "react-hot-toast";
import HeroHeader from "@/components/ui2/heroHeader";

export default function Page() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [images, setImages] = useState<ProductImage[]>([]);
	const [variants, setVariants] = useState<ProductVariant[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
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
			toast.error("Product name is required.");
			return false;
		}
		if (images.length === 0) {
			toast.error("At least one product image is required.", {
				className: "min-w-fit",
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
				toast.success("First image automatically set as main.", {
					className: "min-w-fit",
				});
			} else {
				toast.error("Please select a main image.", { className: "min-w-fit" });
				return false;
			}
		}
		if (variants.length === 0) {
			toast.error("At least one size/color variant is required.", {
				className: "min-w-fit",
			});
			return false;
		}
		if (variants.some((v) => v.quantity <= 0)) {
			toast.error("All variant quantities must be greater than 0.", {
				className: "min-w-fit",
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
			toast.success("Product created successfully!");
			setName("");
			setDescription("");
			setImages([]);
			setVariants([]);
			router.push("/products");
		} catch (error) {
			console.error("Failed to save product:", error);
			toast.error("Failed to save product. See console for details.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6 pb-32 pt-16 relative">
			<HeroHeader>
				Create New Product
				<Smile
					size={30}
					className="text-Secondary"
				/>
			</HeroHeader>
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

				<div className="flex justify-start">
					<Button
						className="bg-Secondary text-white px-6 py-3"
						type="submit">
						<Check />
						{isSubmitting ? "Submitting..." : "Submit Product"}
					</Button>
				</div>
			</form>
		</div>
	);
}
