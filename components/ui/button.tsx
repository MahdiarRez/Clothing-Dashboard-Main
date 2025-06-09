import React from "react";
import clsx from "clsx";

type ButtonProps = {
	as?: "button" | "a";
	isActive?: boolean;
	icon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
	as = "button",
	isActive = false,
	icon,
	children,
	className,
	...props
}: ButtonProps) {
	const Component = as;

	return (
		<Component
			className={clsx(
				"flex items-center gap-2 px-4 py-2 rounded-lg  transition-colors",
				isActive
					? "bg-Primary text-black  "
					: "bg-gray-100 text-gray-800  hover:bg-gray-200",
				className,
			)}
			{...props}>
			{icon && <span>{icon}</span>}
			{children}
		</Component>
	);
}
