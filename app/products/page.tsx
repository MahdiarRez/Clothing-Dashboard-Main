"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getProducts, initDB } from "@/lib/db";
import type { Product } from "@/lib/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProducts() {
			try {
				await initDB();
				const savedProducts = await getProducts();
				setProducts(savedProducts);
			} catch (err) {
				console.error("Failed to fetch products:", err);
				setError("Could not load products.");
			} finally {
				setIsLoading(false);
			}
		}
		fetchProducts();
	}, []);

	if (isLoading) {
		return <p>Loading products...</p>;
	}

	if (error) {
		return <p className="text-destructive">{error}</p>;
	}

	if (products.length === 0) {
		return <p>No products found.</p>;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">View Products</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map((product) => {
					const mainImage =
						product.images.find((img) => img.isMain) || product.images[0];
					return (
						<Card
							key={product.id}
							className="flex flex-col">
							<CardHeader>
								<CardTitle>{product.name}</CardTitle>
								<CardDescription className="line-clamp-3">
									{product.description || "No description."}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-grow space-y-4">
								{mainImage && (
									<div className="relative w-full h-48 rounded-md overflow-hidden border">
										<Image
											src={mainImage.dataUrl || "/placeholder.svg"}
											alt={mainImage.name}
											layout="fill"
											objectFit="cover"
										/>
									</div>
								)}
								{product.images.length > 1 && (
									<ScrollArea className="w-full whitespace-nowrap rounded-md border">
										<div className="flex w-max space-x-2 p-2">
											{product.images
												.filter(
													(img) => !(mainImage && img.id === mainImage.id),
												)
												.map((img) => (
													<div
														key={img.id}
														className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0">
														<Image
															src={img.dataUrl || "/placeholder.svg"}
															alt={img.name}
															layout="fill"
															objectFit="cover"
														/>
													</div>
												))}
										</div>
										<ScrollBar orientation="horizontal" />
									</ScrollArea>
								)}

								<h4 className="font-semibold">Variants:</h4>
								{product.variants.length > 0 ? (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Size</TableHead>
												<TableHead>Color</TableHead>
												<TableHead>Quantity</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{product.variants.map((variant) => (
												<TableRow key={variant.id}>
													<TableCell>{variant.size}</TableCell>
													<TableCell>{variant.color}</TableCell>
													<TableCell>{variant.quantity}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<p className="text-sm text-muted-foreground">
										No variants defined.
									</p>
								)}
							</CardContent>
							<CardFooter className="flex justify-between items-center">
								<Badge variant="secondary">
									Total: {product.totalQuantity}
								</Badge>
								<span className="text-xs text-muted-foreground">
									Created: {new Date(product.createdAt).toLocaleDateString()}
								</span>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
