"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import { Eye, Shirt, SquarePlus } from "lucide-react";
import clsx from "clsx";

export default function Navigation() {
	const pathname = usePathname();

	const navItems = [
		{
			href: "/",
			label: "Create Product",
			icon: <SquarePlus size={20} />,
		},
		{
			href: "/products",
			label: "View Products",
			icon: <Eye size={20} />,
		},
	];

	return (
		<nav className=" container mx-auto">
			<div className="mx-auto flex h-20 items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-lg">
					<span>Clothing Dashboard</span>
				</Link>
				<div className="flex items-center gap-9">
					{navItems.map((item) => (
						<Link
							href={item.href}
							className={clsx(
								`font-medium text-black transition-all duration-200`,
								pathname == item.href
									? "text-Secondary/90 opacity-90 cursor-default"
									: "hover:opacity-40",
							)}
							key={item.href}>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
