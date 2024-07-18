export default defineAppConfig({
	// Nuxt UI
	ui: {
		/**
		 * Nuxt UI uses "gray" as the main theme or background color. I tend to call it primary.
		 * Their "primary" is what I would call an accent color.
		 *
		 * Whenever I use "gray" or "primary" via tailwind classes in the project, they can be hot-switched to whatever I actually change "gray" and "primary" to in this config file during runtime.
		 *
		 * Also, Nuxt UI uses that in their components, so best to adhere to that "standard" so we do not have to totally reinvent the wheel so to speak.
		 */

		// primary color
		gray: "shark",

		// accent color
		primary: "spring-green",

		// button settings
		button: {
			base: "outline-none",
			color: {
				gray: {
					// disable ring and set text/icon color
					solid: "text-color ring-0 bg-gray-100 hover:bg-gray-200",

					// change hover background and set text/icon color
					ghost: "text-color hover:bg-gray-100",
				},
			},
			default: {
				// let this be hot-switchable during runtime to a different theme
				color: "gray",
			},
			variant: {
				inverse:
					"text-white dark:text-black ring-0 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-50",
				hidden: "hidden",
			},
			square: {
				lg: "p-2",
				xl: "p-2",
			},
		},

		// notification settings
		notifications: {
			// smaller notification width
			width: "w-[25%]",
			// show toasts at the top right of the screen
			position: "top-0 bottom-auto",
		},
	},
});
