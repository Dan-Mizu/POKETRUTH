<script setup lang="ts">
// // chart setup
import { use } from "echarts/core";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([TooltipComponent, CanvasRenderer]);

// props
const props = withDefaults(
	defineProps<{
		question: string;
		data: CensusSubmission[];
		multipleChoice?: boolean;
	}>(),
	{
		multipleChoice: false,
	}
);

// filter event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string | number): void;
}>();

// refs
const answerCount = ref(0);

// process data for the word cloud chart
const chartData = computed(() => {
	if (!props.data.length) return [];

	const counts: Record<string, number> = {};
	let totalValidResponses = 0;

	props.data.forEach((entry) => {
		let answer = entry[props.question];

		// only process valid answers, skipping empty/unknown ones
		if (
			answer &&
			(typeof answer === "number" ||
				(typeof answer === "string" &&
					answer.trim() !== "" &&
					answer !== "Unknown"))
		) {
			// normalize to lowercase for case-insensitive counting
			if (typeof answer === "string")
				answer = answer.trim().toLowerCase();

			// get answers
			let answerArray =
				props.multipleChoice && typeof answer === "string"
					? // multiple choice
					  answer.split(",").map((a) => a.trim()) // split and clean
					: // single choice
					  [answer];

			// count the occurrences of each answer
			answerArray.forEach((answer) => {
				counts[answer] = (counts[answer] || 0) + 1;
			});
			totalValidResponses++;
		}
	});

	// store answer count
	answerCount.value = totalValidResponses;

	// convert to required format and capitalize the first letter of each word
	return (
		Object.entries(counts)
			.map(([name, value]) => ({
				// capitalize first letter
				name: name.charAt(0).toUpperCase() + name.slice(1),
				value,
			}))
			// filter out words with fewer than 2 submissions
			.filter((word) => word.value >= 2)
	);
});

// chart settings
const option = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: "{b}: {c}", // Tooltip format: Name: Value
	},
	series: [
		{
			type: "wordCloud",
			shape: "circle",
			keepAspect: true,
			left: "center",
			top: "center",
			width: "80%",
			height: "80%",
			sizeRange: [12, 60],
			rotationRange: [0, 0],
			gridSize: 8,
			drawOutOfBound: false,
			shrinkToFit: false,
			layoutAnimation: true,
			textStyle: {
				fontFamily: "sans-serif",
				fontWeight: "bold",
				color: () =>
					`rgb(${Math.round(Math.random() * 160)}, ${Math.round(
						Math.random() * 160
					)}, ${Math.round(Math.random() * 160)})`,
			},
			emphasis: {
				focus: "self",
				textStyle: {
					textShadowBlur: 10,
					textShadowColor: "#333",
				},
			},
			data: chartData.value.filter((word) => word.value >= 2), // Corrected data structure
		},
	],
}));

// filtering on click event
const onChartClick = (params: any) => {
	emit("filter", props.question, params.name);
};
</script>

<template>
	<ChartWrapper :title="question" :description="`${answerCount} answered.`">
		<VChart :option @click="onChartClick" />
	</ChartWrapper>
</template>
