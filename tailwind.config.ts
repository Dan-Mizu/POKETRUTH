/** @type {import('tailwindcss').Config} */

export default {
	content: ["!./src/server/**/*.ts", "./src/**/*.{vue,ts}"],

	darkMode: "class",

	theme: {
		extend: {
			colors: {
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
