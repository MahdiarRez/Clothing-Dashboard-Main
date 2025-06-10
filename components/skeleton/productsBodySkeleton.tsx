import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ProductSkeletonCard = () => (
	<Card className="flex flex-col bg-gray-100">
		<CardHeader>
			<CardTitle>
				<Skeleton className="h-6 w-3/4" />
			</CardTitle>
			<CardDescription>
				<Skeleton className="h-4 w-full mt-2" />
				<Skeleton className="h-4 w-5/6 mt-1" />
				<Skeleton className="h-4 w-2/3 mt-1" />
			</CardDescription>
		</CardHeader>
		<CardContent className="flex-grow space-y-4">
			<Skeleton className="w-full h-48 rounded-md" />

			<div className="flex space-x-2">
				{[...Array(3)].map((_, i) => (
					<Skeleton
						key={i}
						className="w-16 h-16 rounded-md"
					/>
				))}
			</div>

			<h4 className="font-semibold">Variants:</h4>
			<div className="space-y-2">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="flex items-center justify-between space-x-2">
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-4 w-1/4" />
					</div>
				))}
			</div>
		</CardContent>
		<CardFooter className="flex justify-between items-center">
			<Skeleton className="h-6 w-20 rounded-md" />
			<Skeleton className="h-4 w-24" />
		</CardFooter>
	</Card>
);

const ProductsBodySkeleton = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{[...Array(6)].map((_, i) => (
				<ProductSkeletonCard key={i} />
			))}
		</div>
	);
};

export default ProductsBodySkeleton;
