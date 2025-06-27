import type { BasicInfoProps } from "@/lib/types";
import SectionCard from "./ui/sectionCard";
import SectionHeader from "./ui/sectionHeader";
import SectionBody from "./ui/sectionBody";
import { Info } from "lucide-react";

export default function BasicInfoSection({
	name,
	setName,
	description,
	setDescription,
}: BasicInfoProps) {
	return (
		<SectionCard className="w-full">
			<SectionHeader>
				<div className="p-1.5 rounded-md bg-Secondary/20">
					<Info className="text-Secondary" />
				</div>
				Basic Product Information
			</SectionHeader>
			<SectionBody>
				<div>
					<label htmlFor="productName">Product Name</label>
					<input
						className="w-full tracking-wide border-gray-300 border rounded-md p-3 outline-none mt-2 capitalize text-sm"
						spellCheck={false}
						autoComplete="off"
						id="productName"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Cotton T-Shirt"
						required
					/>
				</div>
				<div>
					<label htmlFor="productDescription">Product Description</label>
					<textarea
						className="w-full border-gray-300 border rounded-md p-3 outline-none mt-2 min-h-20 max-h-52 text-sm tracking-wide"
						id="productDescription"
						value={description}
						spellCheck={false}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe the product..."
						rows={4}
					/>
				</div>
			</SectionBody>
		</SectionCard>
	);
}
