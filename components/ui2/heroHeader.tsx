import { Smile } from "lucide-react";
import AnimateContent from "./animateContent";
import React from "react";

function HeroHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-2 mb-9">
			<AnimateContent
				delay={0.3}
				direction="horizontal"
				reverse>
				<h1 className="text-3xl font-bold text-center flex flex-row items-center gap-2">
					{children}
				</h1>
			</AnimateContent>
			<AnimateContent
				delay={0.7}
				direction="horizontal">
				<p className="text-base opacity-70">
					Craft exceptional fashion pieces that define{" "}
					<span className="text-Secondary font-medium text-lg">luxury</span> and{" "}
					<span className="text-Secondary font-medium text-lg">elegance</span>
				</p>
			</AnimateContent>
		</div>
	);
}

export default HeroHeader;
