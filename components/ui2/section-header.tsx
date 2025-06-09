import React from "react";

function SectionHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-7">
			<h2 className="font-semibold text-xl flex flex-row items-center gap-1.5">
				{children}
			</h2>
		</div>
	);
}

export default SectionHeader;
