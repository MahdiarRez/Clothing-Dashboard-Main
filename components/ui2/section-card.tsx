import React from "react";
import AnimateContent from "./animateContent";

function SectionCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<AnimateContent className={`${className}  bg-white rounded-xl`}>
			{children}
		</AnimateContent>
	);
}

export default SectionCard;
