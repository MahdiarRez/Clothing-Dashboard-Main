"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getProducts, initDB } from "@/lib/db";
import type { Product } from "@/lib/types";
import ProductsBodySkeleton from "./skeleton/productsBodySkeleton";

function ProductsBody() {
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

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	if (isLoading) {
		return <ProductsBodySkeleton />;
	}

	if (products.length === 0) {
		return <p>No products found.</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{products.map((product) => {
				const mainImage =
					product.images.find((img) => img.isMain) || product.images[0];
				return (
					<div
						key={product.id}
						className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
						<div className="p-6 space-y-2">
							<h5 className="font-medium text-xl capitalize">{product.name}</h5>
							<p className="line-clamp-3 text-sm text-gray-600">
								{product.description || "No description."}
							</p>
						</div>
						<div className="flex-grow px-6 pb-6 space-y-4">
							{mainImage && (
								<div className="relative w-full h-48 rounded-md overflow-hidden border">
									<Image
										src={mainImage.dataUrl || "/placeholder.svg"}
										alt={mainImage.name}
										fill
										style={{ objectFit: "cover" }}
									/>
								</div>
							)}

							{product.images.length > 1 && (
								<div className="overflow-x-auto border rounded-lg min-h-20">
									<div className="flex w-max space-x-2 p-2">
										{product.images
											.filter((img) => !(mainImage && img.id === mainImage.id))
											.map((img) => (
												<div
													key={img.id}
													className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0">
													<Image
														src={img.dataUrl || "/placeholder.svg"}
														alt={img.name}
														fill
														style={{ objectFit: "cover" }}
													/>
												</div>
											))}
									</div>
								</div>
							)}

							<h4 className="font-semibold">Variants:</h4>
							{product.variants.length > 0 ? (
								<table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
									<thead className="bg-gray-100">
										<tr>
											<th className="text-left px-3 py-2">Size</th>
											<th className="text-left px-3 py-2">Color</th>
											<th className="text-left px-3 py-2">Qty</th>
										</tr>
									</thead>
									<tbody>
										{product.variants.map((variant) => (
											<tr
												key={variant.id}
												className="border-t">
												<td className="px-3 py-2">{variant.size}</td>
												<td className="px-3 py-2">{variant.color}</td>
												<td className="px-3 py-2">{variant.quantity}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p className="text-sm text-gray-500">No variants defined.</p>
							)}
						</div>
						<div className="px-6 py-4 border-t flex justify-between items-center">
							<span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
								Total: {product.totalQuantity}
							</span>
							<span className="text-xs text-gray-400">
								Created: {new Date(product.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default ProductsBody;
