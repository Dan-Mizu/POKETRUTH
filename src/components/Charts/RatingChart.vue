<script setup lang="ts">
// chart setup
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
	TooltipComponent,
	GridComponent,
	LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([
	BarChart,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CanvasRenderer,
]);

// props
const props = defineProps<{
	question: string;
	data: CensusSubmission[];
}>();

// filter event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string | number): void;
}>();

// process data for the chart
const chartData = computed(() => {
	// no data provided
	if (!props.data.length)
		return {
			labels: [],
			values: [],
			percentages: [],
			totalValidResponses: 0,
		};

	// init counts
	const counts: Record<number, number> = {};
	let highestRating = 1;

	// count each valid answer
	props.data.forEach((entry) => {
		const answer = entry[props.question];
		if (answer && typeof answer === "number" && answer >= 1) {
			// capture highest rating answer
			if (answer > highestRating) highestRating = answer;

			// update counts
			counts[answer] = (counts[answer] || 0) + 1;
		}
	});

	// get amount of responses
	let totalValidResponses = Object.values(counts).reduce(
		(acc, val) => acc + val,
		0
	);

	// calculate the percentages for each rating (1 to 5)
	const labels = Array.from({ length: 5 }, (_, index) =>
		(index + 1).toString()
	);
	const values = labels.map((label) => counts[parseInt(label)] || 0);
	const percentages = values.map((value) =>
		totalValidResponses > 0 ? value / totalValidResponses : 0
	);

	return { labels, values, percentages, totalValidResponses };
});

// chart options (stacked bar chart with percentage)
const option = computed(() => {
	// determine series
	const series = chartData.value.labels.map((label, sid) => {
		return {
			type: "bar",
			stack: "total",
			name: label,
			data: [chartData.value.percentages[sid]],
			label: {
				show: true,
				position: "inside",
				formatter: "{a}",
			},
			barWidth: "60%",
		};
	});

	return {
		tooltip: {
			trigger: "item",
			formatter: (params: any) => {
				return `${params.seriesName} (${(params.value * 100).toFixed(
					2
				)}%)`;
			},
		},
		xAxis: {
			type: "value",
			max: 1, // this ensures the x-axis is from 0 to 1 (percentage)
			axisLabel: {
				show: false,
			},
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			show: false,
			type: "category",
			data: [props.question], // only one question so only one category
			axisLabel: {
				show: false,
			},
		},
		series,
		grid: {
			top: 0,
			bottom: 0,
		},
		legend: {
			show: false, // or position it tightly with `top: 0`
		},
	};
});

// filtering on click event
const onChartClick = (params: any) => {
	emit("filter", props.question, params.seriesName);
};
</script>

<template>
	<ChartWrapper
		:question="props.question"
		:title="props.question"
		:description="`${chartData.totalValidResponses} answered.`"
	>
		<!-- average rating -->
		<div class="flex gap-x-1 items-center justify-center text-center">
			<NuxtIcon
				name="material-symbols:kid-star"
				class="h-14 w-14 text-yellow-500 mt-[0.4rem]"
			/>
			<span class="text-6xl font-bold">
				{{
					(
						chartData.labels.reduce(
							(acc, label, index) =>
								acc + parseInt(label) * chartData.values[index],
							0
						) / chartData.totalValidResponses
					).toFixed(2)
				}}
			</span>
		</div>
		<p class="pt-1 pb-6">Average Rating</p>
		<VChart
			:option="option"
			@click="onChartClick"
			class="w-[900px] h-[120px]"
		/>
	</ChartWrapper>
</template>
