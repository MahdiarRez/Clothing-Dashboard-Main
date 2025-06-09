import type React from "react";
import type { Metadata } from "next";
import { Inter, Jost, Nunito, Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import toast, { Toaster } from "react-hot-toast";

const inter = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
				<main className="container mx-auto pt-12">{children}</main>
				<Toaster position="bottom-left" />
			</body>
		</html>
	);
}
