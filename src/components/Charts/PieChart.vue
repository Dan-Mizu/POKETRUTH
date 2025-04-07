<script setup lang="ts">
// chart setup
import { use } from "echarts/core";
import { PieChart as EPieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([EPieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

// props
const props = withDefaults(
	defineProps<{
		question: string;
		data: CensusSubmission[];
		multipleChoice?: boolean;
		answerOrder?: string[];
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

// process data for the pie chart
const chartData = computed(() => {
	if (!props.data.length) return [];

	const counts: Record<string, number> = {};
	let totalValidResponses = 0;

	props.data.forEach((entry) => {
		const answer = entry[props.question];

		// only process valid answers, skipping non-answers
		if (
			answer &&
			(typeof answer === "number" ||
				(typeof answer === "string" &&
					answer.trim() !== "" &&
					answer !== "Unknown"))
		) {
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

	// prepare data for the pie chart
	const processedData = Object.keys(counts).map((key) => ({
		name: key,
		value: counts[key],
	}));

	// sort by provided answer order if given
	if (props.answerOrder && props.answerOrder.length) {
		// create a lookup from answer name to its index in the order array
		const orderIndex: Record<string, number> = {};
		props.answerOrder.forEach((answer, index) => {
			orderIndex[answer] = index;
		});

		// sort processedData based on that index; unmatched entries go last
		processedData.sort((a, b) => {
			const indexA = orderIndex[a.name] ?? Infinity;
			const indexB = orderIndex[b.name] ?? Infinity;
			return indexA - indexB;
		});
	}

	return processedData;
});

// chart settings
const option = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: "{b}: {c} ({d}%)", // Adds labels to tooltips
	},
	legend: {
		orient: "vertical",
		right: 10,
		top: "center",
	},
	series: [
		{
			name: props.question,
			type: "pie",
			radius: ["40%", "70%"], // Makes it a donut chart, adjust as needed
			center: ["50%", "50%"],
			data: chartData.value,
			animation: true,
			avoidLabelOverlap: true,
			label: {
				show: true,
				position: "outside",
				formatter: "{b}: {c}", // Label format
			},
			emphasis: {
				label: {
					show: true,
					fontSize: "16",
					fontWeight: "bold",
				},
			},
		},
	],
}));

// filtering on click event
const onChartClick = (params: any) => {
	emit("filter", props.question, params.name);
};
</script>

<template>
	<ChartWrapper
		:question
		:title="question"
		:description="`${answerCount} answered.`"
	>
		<VChart :option @click="onChartClick" />
	</ChartWrapper>
</template>
