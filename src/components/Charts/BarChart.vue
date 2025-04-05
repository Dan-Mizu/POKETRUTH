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

// process data for the bar chart
const chartData = computed(() => {
	if (!props.data.length) return { labels: [], values: [] };

	const counts: Record<string, number> = {};
	let totalValidResponses = 0;

	props.data.forEach((entry) => {
		const answer = entry[props.question];

		if (
			answer &&
			(typeof answer === "number" ||
				(typeof answer === "string" &&
					answer.trim() !== "" &&
					answer !== "Unknown"))
		) {
			let answerArray =
				props.multipleChoice && typeof answer === "string"
					? answer.split(",").map((a: string) => a.trim())
					: [answer];

			answerArray.forEach((answer: string | number) => {
				counts[answer] = (counts[answer] || 0) + 1;
			});
			totalValidResponses++;
		}
	});

	answerCount.value = totalValidResponses;

	// convert counts object into array for sorting
	let sorted = Object.entries(counts);

	// apply custom order if provided
	if (props.answerOrder && props.answerOrder.length > 0) {
		const orderMap = new Map(
			props.answerOrder.map((label, index) => [label, index])
		);
		sorted.sort((a, b) => {
			const aIndex = orderMap.has(a[0]) ? orderMap.get(a[0])! : Infinity;
			const bIndex = orderMap.has(b[0]) ? orderMap.get(b[0])! : Infinity;
			return aIndex - bIndex;
		});
	} else {
		// otherwise, sort by count descending
		sorted.sort((a, b) => b[1] - a[1]);
	}

	const labels = sorted.map(([label]) => label);
	const values = sorted.map(([, value]) => value);

	return { labels, values };
});

// chart settings
const option = computed(() => ({
	tooltip: {
		trigger: "axis",
		formatter: (params: any) => {
			const total = chartData.value.values.reduce(
				(sum, val) => sum + val,
				0
			);
			return params
				.map((item: any) => {
					const percent = ((item.value / total) * 100).toFixed(1);
					return `${item.name}: ${item.value} (${percent}%)`;
				})
				.join("<br>");
		},
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
