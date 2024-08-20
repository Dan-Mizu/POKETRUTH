<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
	<!-- Main Page -->
	<NuxtPage />

	<!-- Nuxt UI Notifications -->
	<UNotifications />

	<!-- Vercel Speed Insights -->
	<SpeedInsights />
</template>

<style>
/* * {
	outline: 1px solid red;
} */

/* * {
	@apply transition-all duration-300;
} */

body {
	@apply bg-black text-white;
}

/* hidden scrollbar */
.scrollbar-hidden::-webkit-scrollbar {
	@apply hidden;
}

.scrollbar-hidden {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* image rendering */
.rendering-auto {
	image-rendering: auto;
}

.rendering-crisp-edges {
	image-rendering: crisp-edges;
}

.rendering-pixelated {
	image-rendering: pixelated;
}
</style>
