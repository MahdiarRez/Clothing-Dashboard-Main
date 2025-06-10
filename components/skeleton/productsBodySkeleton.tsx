const ProductSkeletonCard = () => (
	<div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden animate-pulse">
		{/* Header */}
		<div className="p-4 space-y-2">
			<div className="h-6 w-3/4 bg-gray-300 rounded" />
			<div className="space-y-1 mt-2">
				<div className="h-4 w-full bg-gray-300 rounded" />
				<div className="h-4 w-5/6 bg-gray-300 rounded" />
				<div className="h-4 w-2/3 bg-gray-300 rounded" />
			</div>
		</div>

		{/* Image */}
		<div className="flex-grow p-4 space-y-4">
			<div className="w-full h-48 bg-gray-300 rounded-md" />

			<div className="flex space-x-2">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="w-16 h-16 bg-gray-300 rounded-md"
					/>
				))}
			</div>

			<h4 className="font-semibold text-gray-400">Variants:</h4>
			<div className="space-y-2">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="flex items-center justify-between space-x-2">
						<div className="h-4 w-1/4 bg-gray-300 rounded" />
						<div className="h-4 w-1/4 bg-gray-300 rounded" />
						<div className="h-4 w-1/4 bg-gray-300 rounded" />
					</div>
				))}
			</div>
		</div>

		{/* Footer */}
		<div className="p-4 flex justify-between items-center">
			<div className="h-6 w-20 bg-gray-300 rounded-md" />
			<div className="h-4 w-24 bg-gray-300 rounded" />
		</div>
	</div>
);

const ProductsBodySkeleton = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{[...Array(6)].map((_, i) => (
			<ProductSkeletonCard key={i} />
		))}
	</div>
);

export default ProductsBodySkeleton;
