<script setup lang="ts">
// theme
const colorMode = useColorMode();

// local dark mode value
const isDark = ref(colorMode.value === "dark");

// toggle dark mode
const toggleDarkMode = () => {
	// toggle local dark mode value
	isDark.value = !isDark.value;

	// change global color mode preference
	colorMode.preference = isDark.value ? "dark" : "light";
};
</script>

<template>
	<ClientOnly>
		<UButton
			class="p-2"
			@click="toggleDarkMode"
			title="Toggle Theme"
			variant="ghost"
			:ui="{
				color: {
					gray: {
						ghost: 'hover:bg-gray-200 dark:hover:bg-gray-900',
					},
				},
			}"
		>
			<NuxtIcon
				:name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
				class="h-4 w-4"
			/>
		</UButton>
	</ClientOnly>
</template>
