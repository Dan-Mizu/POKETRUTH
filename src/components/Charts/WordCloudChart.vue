<script setup lang="ts">
// dark mode
const colorMode = useColorMode();

// chart setup
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

// refs
const answerCount = ref(0);

// process data for the word cloud chart
const chartData = computed(() => {
	if (!props.data.length) return [];

	const counts: Record<string, number> = {};

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
		}
	});

	// convert to required format and capitalize the first letter of each word
	const filteredData = Object.entries(counts)
		.map(([name, value]) => ({
			name: name.charAt(0).toUpperCase() + name.slice(1),
			value,
		}))
		.filter((word) => word.value >= 2);

	// count only the answers being shown
	answerCount.value = filteredData.reduce(
		(sum, entry) => sum + entry.value,
		0
	);

	return filteredData;
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
					colorMode.value === "dark"
						? // dark mode, lighter colors
						  `rgb(${Math.round(
								160 + Math.random() * 95
						  )}, ${Math.round(
								160 + Math.random() * 95
						  )}, ${Math.round(160 + Math.random() * 95)})`
						: // normal, light mode colors
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
			data: chartData.value.filter((word) => word.value >= 2), // corrected data structure
		},
	],
}));

// filtering on click event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string | number): void;
}>();
const onChartClick = (params: any) => {
	emit("filter", props.question, params.name);
};

// update chart when color mode changes
const chartInstance = ref(0);
watch(colorMode, () => {
	chartInstance.value++;
});
</script>

<template>
	<ChartWrapper
		:question
		:title="question"
		:description="`${answerCount} answered.`"
	>
		<VChart
			:key="chartInstance"
			:option
			@click="onChartClick"
			class="w-[900px] h-[400px]"
		/>
	</ChartWrapper>
</template>
