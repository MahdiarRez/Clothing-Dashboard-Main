"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import { Eye, icons, Shirt, SquarePlus } from "lucide-react";

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
		<nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
			<div className="px-20 mx-auto flex h-16 items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-lg">
					<Shirt className="h-6 w-6 text-primary" />
					<span>Clothing Dashboard</span>
				</Link>
				<div className="flex items-center gap-4">
					{navItems.map((item) => (
						<Link href={item.href}>
							<Button
								key={item.href}
								isActive={pathname === item.href}
								icon={item.icon}>
								{item.label}
							</Button>
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
