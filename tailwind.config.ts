import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				Gray: "#F2F3F5",
				Primary: "#CEEAF7",
				Secondary: "#F4A261",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
