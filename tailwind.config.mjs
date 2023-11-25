/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"ula-green" : "#17bbac",
				"ula-blue" : "#1b6d8c",
			}
		},
	},
	plugins: [],
}
