<script setup lang="ts">
// props
const props = defineProps<{
	title: string;
}>();
</script>

<template>
	<div class="w-full flex items-center justify-center flex-col gap-y-3">
		<!-- title -->
		<div class="w-[50%] text-center">
			<span class="text-2xl font-bold text-gray-500">{{ title }}</span>
		</div>

		<!-- chart -->
		<div>
			<slot />
		</div>
	</div>
</template>
