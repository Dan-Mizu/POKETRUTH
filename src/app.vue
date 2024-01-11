<template>
	<NuxtPage />
</template>

<style>
/* * {
	outline: 1px solid red;
} */

/* * {
	@apply transition-all duration-300;
} */

body {
	font-family: "Anonymous Pro";
	@apply bg-black text-lime-500;
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
