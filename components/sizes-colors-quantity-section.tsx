"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, PencilRuler, PlusSquare, Trash2 } from "lucide-react";
import {
	type ProductVariant,
	type SizesColorsQuantityProps,
	AVAILABLE_SIZES,
	AVAILABLE_COLORS,
} from "@/lib/types";
import Button from "./ui/button";

type DropdownProps = {
	options: string[];
	value: string;
	onChange: (val: string) => void;
	renderLabel?: (opt: string) => React.ReactNode;
};

function Dropdown({ options, value, onChange, renderLabel }: DropdownProps) {
	const [open, setOpen] = useState(false);
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function onClick(e: MouseEvent) {
			if (container.current && !container.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, []);

	return (
		<div
			ref={container}
			className=" w-full">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="w-full flex justify-between items-center border rounded-lg px-1.5 text-xs sm:text-sm sm:px-4 py-2 hover:shadow transition">
				<span className="truncate">
					{renderLabel ? renderLabel(value) : value}
				</span>
				<ChevronDown className="h-5 w-5 text-gray-500" />
			</button>

			<AnimatePresence>
				{open && (
					<motion.ul
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.15 }}
						className="absolute top-[90%] left-1 right-1 sm:left-5 sm:right-5 z-30 bg-white border rounded-lg shadow max-h-52 overflow-auto mt-1">
						{options.map((opt) => (
							<li
								key={opt}
								onClick={() => {
									onChange(opt);
									setOpen(false);
								}}
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate">
								{renderLabel ? renderLabel(opt) : opt}
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
}

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
								field === "quantity"
									? Number(value) < 0
										? 1
										: Number(value)
									: value,
					  }
					: v,
			),
		);
	};

	const removeVariant = (id: string) => {
		setVariants(variants.filter((v) => v.id !== id));
	};

	return (
		<div className="bg-white rounded-lg shadow ">
			{/* Header */}
			<div className="flex items-center px-6 py-4 border-b">
				<div className="p-1.5 rounded-md bg-secondary/20 mr-2">
					<PencilRuler
						className="text-secondary"
						size={18}
					/>
				</div>
				<h2 className="text-lg font-medium">Sizes, Colors & Quantity</h2>
			</div>

			{/* Body */}
			<div className="p-6 px-4 sm:px-6 space-y-4 ">
				<Button
					type="button"
					onClick={addVariant}
					className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
					<PlusSquare className="h-5 w-5 mr-1" />
					Add Variant
				</Button>

				{variants.length > 0 && (
					<div className=" relative">
						<table className="w-full text-sm table-auto ">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-2 text-xs sm:text-sm sm:px-5 py-2 text-left">
										Size
									</th>
									<th className="px-2 text-xs sm:text-sm sm:px-5 py-2 text-left">
										Color
									</th>
									<th className="px-2 text-xs sm:text-sm sm:px-5 py-2 text-left">
										Qty
									</th>
									<th className="px-1 py-2 hidden sm:block sm:text-sm">
										Remove
									</th>
								</tr>
							</thead>
							<tbody>
								{variants.map((v) => (
									<tr
										key={v.id}
										className="border-b last:border-0 relative">
										<td className=" py-2 relative px-2 sm:px-5 max-w-[70px] min-w-[100px]">
											<Dropdown
												options={AVAILABLE_SIZES}
												value={v.size}
												onChange={(val) => updateVariant(v.id, "size", val)}
											/>
										</td>
										<td className="py-2 relative px-2 sm:px-5 max-w-[70px] min-w-[100px]">
											<Dropdown
												options={AVAILABLE_COLORS}
												value={v.color}
												onChange={(val) => updateVariant(v.id, "color", val)}
												renderLabel={(col) => (
													<span className="flex items-center space-x-2">
														<span
															className="inline-block w-4 h-4 rounded-full border"
															style={{ backgroundColor: col }}
														/>
														<span className="truncate">{col}</span>
													</span>
												)}
											/>
										</td>
										<td className="px-1.5 sm:px-4 py-2">
											<input
												type="number"
												value={v.quantity}
												onChange={(e) =>
													updateVariant(
														v.id,
														"quantity",
														Number(e.target.value),
													)
												}
												className="w-10 sm:w-20 border rounded-md px-2 py-1.5 outline-none"
											/>
										</td>
										<td className="px-4 py-2 text-center">
											<button
												type="button"
												onClick={() => removeVariant(v.id)}
												className="p-2 hover:bg-red-100 rounded-lg">
												<Trash2 className="h-4 w-4 text-red-600" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="text-left">
					<span className="text-lg font-medium">
						Total Quantity : {totalQuantity}
					</span>
				</div>
			</div>
		</div>
	);
}
