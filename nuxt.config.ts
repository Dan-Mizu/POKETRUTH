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
	devtools: { enabled: true },
	srcDir: "src",
	components: [
		{
			path: "~/components", // will get any components nested in let's say /components/test too
			pathPrefix: false,
		},
	],
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
	googleFonts: {
		preload: true,
		prefetch: true,
		families: {
			"Anonymous Pro": {
				wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
				ital: [100, 200, 300, 400, 500, 600, 700, 800, 900],
			},
		},
	},
});
