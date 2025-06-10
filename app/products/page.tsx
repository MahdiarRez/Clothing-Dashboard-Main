import { Laugh } from "lucide-react";
import HeroHeader from "@/components/ui2/heroHeader";
import ProductsBodySkeleton from "@/components/skeleton/productsBodySkeleton";
import ProductsBody from "@/components/productsBody";
import { Suspense } from "react";

export default function Page() {
	return (
		<div className="space-y-6 pb-12 pt-16 relative">
			<HeroHeader>
				List of Your Porducts
				<Laugh
					size={30}
					className="text-Secondary z-10"
				/>
			</HeroHeader>
			<ProductsBody />
		</div>
	);
}
