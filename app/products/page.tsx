import { Laugh } from "lucide-react";
import HeroHeader from "@/components/ui2/heroHeader";
import ProductsBody from "@/components/productsBody";

export default function Page() {
	return (
		<div className="space-y-6 pb-32 pt-16 relative ">
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
