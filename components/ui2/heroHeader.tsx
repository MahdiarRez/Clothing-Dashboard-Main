"use client";
import { Smile } from "lucide-react";
import AnimateContent from "./animateContent";
import React from "react";

function HeroHeader({ children }: { children: React.ReactNode }) {
	console.log("HeroHeader rendered");
	return (
		<div className="flex flex-col items-center gap-2 mb-9 p-6">
			<h1 className="text-xl text-nowrap flex-nowrap sm:text-3xl font-bold text-center flex flex-row items-center gap-2 text-black">
				{children}
			</h1>
			<p className="text-sm text-center sm:text-base opacity-70">
				Craft exceptional fashion pieces that define{" "}
				<span className="text-Secondary font-medium text-base sm:text-lg">
					luxury
				</span>{" "}
				and{" "}
				<span className="text-Secondary font-medium text-base sm:text-lg">
					elegance
				</span>
			</p>
		</div>
	);
}

export default HeroHeader;
