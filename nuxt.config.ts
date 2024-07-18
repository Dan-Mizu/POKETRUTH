import { name, version, author } from "./package.json";

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
					href: "/favicons/site.webmanifest",
				},
				{
					rel: "mask-icon",
					color: "#000000",
					href: "/favicons/safari-pinned-tab.svg",
				},
				{
					rel: "shortcut icon",
					href: "/favicons/favicon.ico",
				},
			],
		},
	},

	runtimeConfig: {
		firebaseClientEmail: "",
		firebasePrivateKey: "",
		firebaseProjectId: "",
		firebaseDatabaseUrl: "",
		twitchAppClientSecret: "",
		public: {
			twitchAppClientId: "",
			version,
			userAgent: `${name}/${version} (${author.email})`,
		},
	},

	srcDir: "src",
	serverDir: "server",

	components: [
		{
			path: "~/components", // will get any components nested in let's say /components/test too
			pathPrefix: false,
		},
	],

	modules: ["@nuxt/ui", "@nuxtjs/google-fonts", "@nuxt/icon"],

	googleFonts: {
		base64: true,
		families: {
			"Anonymous Pro": true,
			Underdog: true,
		},
	},

	icon: {
		componentName: "NuxtIcon",
	},

	devtools: { enabled: true },
	compatibilityDate: "2024-07-16",
});
