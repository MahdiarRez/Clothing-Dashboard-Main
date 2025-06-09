import React from "react";
import AnimateContent from "./animateContent";

function SectionCard({
	children,
	className,
	delay,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<AnimateContent
			delay={delay}
			initialOpacity={0.4}
			className={`${className}  bg-white rounded-xl`}>
			{children}
		</AnimateContent>
	);
}

export default SectionCard;
