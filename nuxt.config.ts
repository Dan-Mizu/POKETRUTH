// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			title: "POKE TRUTH",
			link: [
				{
					rel: "icon",
					type: "image/x-icon",
					href: "/favicons/favicon.ico",
				},
				{
					rel: "manifest",
					href: "favicons/site.webmanifest",
				},
				{
					rel: "mask-icon",
					color: "#000000",
					href: "favicons/safari-pinned-tab.svg",
				},
				{
					rel: "shortcut icon",
					href: "favicons/favicon.ico",
				},
			],
		},
	},

	srcDir: "src",

	components: [
		{
			path: "~/components", // will get any components nested in let's say /components/test too
			pathPrefix: false,
		},
	],

	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],

	googleFonts: {
		base64: true,
		families: {
			"Anonymous Pro": true,
			Underdog: true,
		},
	},

	devtools: { enabled: true },
});
