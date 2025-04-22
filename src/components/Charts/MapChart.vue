<script setup lang="ts">
// dark mode
const colorMode = useColorMode();

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
		data: CensusSubmission[];
		multipleChoice?: boolean;
	}>(),
	{
		multipleChoice: false,
	}
);

// refs
const answerCount = ref(0);
const cleanedToRawMap = ref<Record<string, Set<string | number>>>({});

// process the raw data into chart-ready format and a cleaned-to-raw map.
function processChartData() {
	const counts: Record<string, number> = {};
	const rawMap: Record<string, Set<string | number>> = {};
	let total = 0;

	for (const entry of props.data) {
		let answer = entry[props.question];

		if (
			answer &&
			(typeof answer === "number" ||
				(typeof answer === "string" &&
					answer.trim() !== "" &&
					answer !== "Unknown"))
		) {
			// format and cleanup
			if (typeof answer === "string")
				answer = answer.replace(
					"US territories (Guam, Puerto Rico, etc)",
					"Puerto Rico"
				);
			const answerArray =
				props.multipleChoice && typeof answer === "string"
					? answer.split(",").map((a) => a.trim())
					: [answer];

			for (const raw of answerArray) {
				const cleaned =
					typeof raw === "string"
						? raw.replace(/\s*\(\w{2}\)$/, "") // remove state abbreviations
						: raw;

				// count answer
				counts[cleaned] = (counts[cleaned] || 0) + 1;

				// build reverse lookup
				if (!rawMap[cleaned]) rawMap[cleaned] = new Set();
				rawMap[cleaned].add(raw);
			}

			total++;
		}
	}

	// Save values to refs
	cleanedToRawMap.value = rawMap;
	answerCount.value = total;

	// Convert counts to chart-friendly format
	return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// computed chart data
const chartData = computed(() => processChartData());

// chart settings
const option = computed(() => {
	const values = chartData.value.map((entry) => entry.value);

	// fallback when no data
	if (values.length === 0) {
		return {
			tooltip: { show: false },
			visualMap: { show: false },
			series: [
				{
					type: "map",
					map: props.map,
					data: [],
				},
			],
		};
	}

	const rawMin = Math.min(...values);
	const rawMax = Math.max(...values);

	const isFlat = rawMin === rawMax;
	const min = isFlat ? 0 : rawMin;
	const max = isFlat ? rawMax || 10 : rawMax;

	return {
		tooltip: {
			trigger: "item",
			formatter: (params: { value: number; name: string }) => {
				const value =
					typeof params.value === "number" && !isNaN(params.value)
						? params.value
						: 0;
				return `${params.name}: ${value}`;
			},
		},
		visualMap: {
			left: "right",
			min,
			max,
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
			outOfRange: {
				color: colorMode.value === "dark" ? "#292524" : "#0b3d91",
			},
			textStyle: {
				color: colorMode.value === "dark" ? "white" : "black",
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
						show: false,
					},
				},
				data: chartData.value,
			},
		],
	};
});

// filtering on click event
const emit = defineEmits<{
	(event: "filter", questionKey: string, value: string | number): void;
}>();
const onChartClick = (params: { name: string }) => {
	const cleaned = params.name;
	const rawSet = cleanedToRawMap.value[cleaned];

	if (rawSet && rawSet.size > 0) {
		for (const rawValue of rawSet) {
			emit("filter", props.question, rawValue);
		}
	} else {
		// Fallback in case cleaned name not found
		emit("filter", props.question, cleaned);
	}
};

// update chart when specific viewport size breakpoint reached
const viewport = useViewport();
const chartInstance = ref(0);
watch(viewport.breakpoint, (newBreakpoint) => {
	if (!newBreakpoint.includes("desktop")) chartInstance.value++;
});
</script>

<template>
	<ChartWrapper
		:question
		:title="question"
		:description="`${answerCount} answered.`"
	>
		<VChart
			:option
			@click="onChartClick"
			:class="[
				viewport.isGreaterOrEquals('tablet')
					? 'w-[900px] h-[600px]'
					: 'w-screen h-[300px]',
			]"
		/>
	</ChartWrapper>
</template>
