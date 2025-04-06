<script setup lang="ts">
// props
const props = defineProps<{
	question: string;
	title: string;
	description?: string;
}>();
</script>

<template>
	<div class="w-full flex items-center justify-center flex-col gap-y-3">
		<div
			:id="question"
			class="flex flex-col gap-y-1 text-center w-[50%] sm:w-[30rem] mx-10 whitespace-break-spaces"
		>
			<!-- title -->
			<span class="text-xl sm:text-2xl font-bold text-gray-500"
				>{{ title }}
			</span>
			<!-- description -->
			<span class="text-base sm:text-lg text-gray-300">{{
				description
			}}</span>
		</div>

		<!-- chart -->
		<div>
			<slot />
		</div>
	</div>
</template>
