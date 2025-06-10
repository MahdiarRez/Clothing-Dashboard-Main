import React from "react";
import clsx from "clsx";

type ButtonProps = {
	as?: "button" | "a";
	isActive?: boolean;
	icon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	type?: "submit" | "reset" | "button";
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
	as = "button",
	isActive = false,
	type = "button",
	icon,
	children,
	className,
	...props
}: ButtonProps) {
	const Component = as;

	return (
		<Component
			type={type}
			className={clsx(
				"flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-65 transition-opacity duration-200",
				isActive && "bg-Primary text-black",
				className,
			)}
			{...props}>
			{icon && <span>{icon}</span>}
			{children}
		</Component>
	);
}
