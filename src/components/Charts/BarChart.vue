<script setup lang="ts">
// chart setup
import { use } from "echarts/core";
import { BarChart as EBarChart } from "echarts/charts";
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([
	EBarChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	CanvasRenderer,
]);

// props
const props = withDefaults(
	defineProps<{
		question: string;
		data: { [key: string]: string }[];
		multipleChoice?: boolean;
	}>(),
	{
		multipleChoice: false,
	}
);

// filter event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string): void;
}>();

// refs
const answerCount = ref(0);

// process data for the bar chart
const chartData = computed(() => {
	if (!props.data.length) return { labels: [], values: [] };

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
			let answerArray = props.multipleChoice
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

	return {
		labels: Object.keys(counts),
		values: Object.values(counts),
	};
});

// chart settings
const option = computed(() => ({
	tooltip: {
		trigger: "axis",
		formatter: "{b}: {c} ({d}%)", // Adds labels to tooltips
	},
	xAxis: {
		type: "category",
		data: chartData.value.labels,
		axisLabel: { rotate: 45 },
	},
	yAxis: {
		type: "value",
	},
	series: [
		{
			name: props.question,
			type: "bar",
			data: chartData.value.values,
			itemStyle: { color: "#3498db" },
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
