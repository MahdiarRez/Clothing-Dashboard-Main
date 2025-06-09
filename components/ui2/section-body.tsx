import React from "react";

function SectionBody({ children }: { children: React.ReactNode }) {
	return <section className="space-y-4 px-8 pb-7">{children}</section>;
}

export default SectionBody;
