<script setup lang="ts">
// chart setup
import { use } from "echarts/core";
import { PieChart as EPieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([EPieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

// props
const props = defineProps<{
	question: string;
	data: { [key: string]: string }[];
}>();

// filter event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string): void;
}>();

// process data for the pie chart
const chartData = computed(() => {
	if (!props.data.length) return [];

	const counts: Record<string, number> = {};
	let totalValidResponses = 0;

	props.data.forEach((entry) => {
		const answer = entry[props.question];

		// only process valid answers, skipping non-answers
		if (answer && answer.trim() !== "" && answer !== "Unknown") {
			counts[answer] = (counts[answer] || 0) + 1;
			totalValidResponses++;
		}
	});

	// prepare data for the pie chart
	const processedData = Object.keys(counts).map((key) => ({
		name: key,
		value: counts[key],
	}));

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
	<ChartWrapper :title="question">
		<VChart class="chart" :option @click="onChartClick" />
	</ChartWrapper>
</template>
