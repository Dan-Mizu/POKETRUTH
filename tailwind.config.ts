/** @type {import('tailwindcss').Config} */

export default {
	content: ["!./src/server/**/*.ts", "./src/**/*.{vue,ts}"],

	darkMode: "class",

	theme: {
		extend: {
			colors: {
				// primary
				shark: {
					"50": "#f6f6f6",
					"100": "#e7e7e7",
					"200": "#d1d1d1",
					"300": "#b0b0b0",
					"400": "#888888",
					"500": "#6d6d6d",
					"600": "#5d5d5d",
					"700": "#4f4f4f",
					"800": "#454545",
					"900": "#252526",
					"950": "#1e1e1e",
				},

				// accent
				"spring-green": {
					50: "#eefff5",
					100: "#d7ffea",
					200: "#b2ffd7",
					300: "#52ffa8",
					400: "#33f594",
					500: "#09de74",
					600: "#01b85d",
					700: "#05904c",
					800: "#0a713f",
					900: "#0a5d36",
					950: "#00341c",
				},
			},
		},
	},

	plugins: [],
};
