import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Clothing Dashboard",
	description: "Manage your clothing products",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} bg-gradient-to-tr from-Primary/80 via-Primary/50 to-Primary/80`}>
				<Navigation />
				<main className="container mx-auto p-4 pt-20">{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
