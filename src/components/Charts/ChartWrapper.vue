<script setup lang="ts">
// notifications
const toast = useToast();

// props
const props = defineProps<{
	question: string;
	title: string;
	description?: string;
}>();

function selectQuestion() {
	// copy question link to clipboard
	const baseUrl = window.location.origin + window.location.pathname;
	const fullUrl = `${baseUrl}#${props.question}`;
	navigator.clipboard
		.writeText(fullUrl)
		.then(() => {
			toast.add({
				title: `Copied ${fullUrl}`,
				icon: "i-heroicons-check-circle-20-solid",
				color: "green",
				ui: {
					background: "bg-white dark:bg-gray-950",
				},
			});
		})
		.catch((err) => {
			toast.add({
				title: `Failed to copy link ${err}`,
				icon: "i-heroicons-x-circle-20-solid",
				color: "red",
				ui: {
					background: "bg-white dark:bg-gray-950",
				},
			});
		});

	// update hash
	window.location.hash = props.question;
}
</script>

<template>
	<div class="w-full flex flex-col gap-y-3 items-center justify-center">
		<button
			:id="question"
			@click="selectQuestion"
			class="flex flex-col gap-y-1 text-center w-[80%] sm:w-[30rem] mx-10 whitespace-break-spaces group"
		>
			<!-- title -->
			<div
				class="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-300"
			>
				<span class="relative inline-block">
					<!-- copy link to question visual indicator -->
					<NuxtIcon
						name="mdi:link-variant"
						class="absolute -left-7 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
					/>
					{{ title }}
				</span>
			</div>

			<!-- description -->
			<span class="text-base sm:text-lg text-gray-300 dark:text-gray-400">
				{{ description }}
			</span>
		</button>

		<!-- chart -->
		<div>
			<slot />
		</div>
	</div>
</template>
