"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PencilRuler, PlusCircle, PlusSquare, Trash2 } from "lucide-react";
import {
	type ProductVariant,
	type SizesColorsQuantityProps,
	AVAILABLE_SIZES,
	AVAILABLE_COLORS,
} from "@/lib/types";
import SectionCard from "./ui2/section-card";
import SectionHeader from "./ui2/section-header";
import SectionBody from "./ui2/section-body";

export default function SizesColorsQuantitySection({
	variants,
	setVariants,
	totalQuantity,
}: SizesColorsQuantityProps) {
	const addVariant = () => {
		setVariants([
			...variants,
			{
				id: crypto.randomUUID(),
				size: AVAILABLE_SIZES[0],
				color: AVAILABLE_COLORS[0],
				quantity: 1,
			},
		]);
	};

	const updateVariant = (
		id: string,
		field: keyof ProductVariant,
		value: string | number,
	) => {
		setVariants(
			variants.map((v) =>
				v.id === id
					? {
							...v,
							[field]:
								field === "quantity" ? Math.max(0, Number(value)) : value,
					  }
					: v,
			),
		);
	};

	const removeVariant = (id: string) => {
		setVariants(variants.filter((v) => v.id !== id));
	};

	return (
		<SectionCard>
			<SectionHeader>
				<PencilRuler />
				Sizes, Colors & Quantity
			</SectionHeader>

			<SectionBody>
				<Button
					onClick={addVariant}
					type="button">
					<PlusSquare className="h-6 w-6 mr-1" /> Add Size/Color Variant
				</Button>

				{variants.length > 0 && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Size</TableHead>
								<TableHead>Color</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{variants.map((variant) => (
								<TableRow key={variant.id}>
									<TableCell>
										<Select
											value={variant.size}
											onValueChange={(value) =>
												updateVariant(variant.id, "size", value)
											}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{AVAILABLE_SIZES.map((size) => (
													<SelectItem
														key={size}
														value={size}>
														{size}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<Select
											value={variant.color}
											onValueChange={(value) => {
												console.log(variants);
												return updateVariant(variant.id, "color", value);
											}}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{AVAILABLE_COLORS.map((color) => (
													<SelectItem
														key={color}
														value={color}>
														{color}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<Input
											type="number"
											value={variant.quantity}
											onChange={(e) =>
												updateVariant(
													variant.id,
													"quantity",
													Number.parseInt(e.target.value, 10),
												)
											}
											min="0"
											className="w-20"
										/>
									</TableCell>
									<TableCell>
										<Button
											type="button"
											onClick={() => removeVariant(variant.id)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				<div className="mt-4 text-right">
					<Label className="text-lg font-semibold">
						Total Quantity: {totalQuantity}
					</Label>
				</div>
			</SectionBody>
		</SectionCard>
	);
}
