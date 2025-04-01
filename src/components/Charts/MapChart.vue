<script setup lang="ts">
// chart setup
import { use } from "echarts/core";
import { MapChart as EMapChart } from "echarts/charts";
import { TooltipComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([EMapChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);
import { registerMap } from "echarts/core";
import northAmericaJson from "~/assets/data/geo/north-america.json";
import europeJson from "~/assets/data/geo/europe.json";
registerMap("Europe", europeJson as any);
registerMap("North America", northAmericaJson as any);

// props
const props = withDefaults(
	defineProps<{
		map: "Europe" | "North America";
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

// process data for the map chart
const chartData = computed(() => {
	if (!props.data.length) return [];

	const counts: Record<string, number> = {};
	let totalValidResponses = 0;

	props.data.forEach((entry) => {
		let answer = entry[props.question];

		// only process valid answers, skipping non-answers
		if (
			answer &&
			(typeof answer === "number" ||
				(typeof answer === "string" &&
					answer.trim() !== "" &&
					answer !== "Unknown"))
		) {
			// format answers
			answer = answer.replace(/\s*\(\w{2}\)$/, "");
			answer = answer.replace(
				"US territories (Guam, Puerto Rico, etc)",
				"Puerto Rico"
			);

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

	// Convert counts to an array of objects for ECharts
	return Object.entries(counts).map(([name, value]) => ({ name, value }));
});

// chart settings
const option = computed(() => {
	// extract values from chartData
	const values = chartData.value.map((entry) => entry.value);

	return {
		tooltip: {
			trigger: "item",
			formatter: (params: { value: number; name: any }) => {
				// show value, or 0 if none exists
				const value = params.value > 0 ? params.value : 0;
				return `${params.name}: ${value}`;
			},
		},
		visualMap: {
			left: "right",
			min: Math.min(...values) || 1, // smallest answer number, default to 1
			max: Math.max(...values) || 10, // largest answer number, default to 10
			inRange: {
				color: [
					"#c6e6f1",
					"#a7d8eb",
					"#74add1",
					"#4595c6",
					"#2a7ab7",
					"#185a9d",
					"#0b3d91",
				],
			},
			text: ["High", "Low"],
			calculable: true,
		},
		series: [
			{
				name: props.question,
				type: "map",
				roam: true,
				map: props.map,
				emphasis: {
					label: {
						show: true,
					},
				},
				data: chartData.value,
				itemStyle: { color: "#3498db" },
			},
		],
	};
});

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
