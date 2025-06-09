"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BasicInfoProps } from "@/lib/types";
import SectionCard from "./ui2/section-card";
import SectionHeader from "./ui2/section-header";
import SectionBody from "./ui2/section-body";
import { BookText } from "lucide-react";

export default function BasicInfoSection({
	name,
	setName,
	description,
	setDescription,
}: BasicInfoProps) {
	return (
		<SectionCard>
			<SectionHeader>
				<BookText /> Basic Product Information
			</SectionHeader>
			<SectionBody>
				<div>
					<label htmlFor="productName">Product Name</label>
					<input
						className="w-full border-gray-300 border rounded-md p-3 outline-none mt-2 capitalize text-sm"
						spellCheck={false}
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
						className="w-full border-gray-300 border rounded-md p-3 outline-none mt-2 min-h-20 max-h-52 text-sm"
						id="productDescription"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe the product..."
						rows={4}
					/>
				</div>
			</SectionBody>
		</SectionCard>
	);
}
