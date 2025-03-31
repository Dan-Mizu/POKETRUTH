<script setup lang="ts">
// csv data file path
const csvFilePath = "2025.csv";

// chart config
const chartConfig: { [key: string]: string } = {
	Timestamp: "exclude",
};

// data references
const rawData: Ref<{ [key: string]: string }[]> = ref([]); // full data
const activeFilter: Ref<{ questionKey: string; value: any } | null> = ref(null); // tracks active filter
const chartTypes = ref<{ [key: string]: string | null }>({}); // mapping of questions to chart types

onMounted(async () => {
	const response = await fetch(csvFilePath);
	const csvText = await response.text();

	// parse CSV
	const parsedData = (await parseCsv(csvText)) as { [key: string]: string }[];

	// remove "declined to answer" responses and empty values
	rawData.value = parsedData.map((entry) => {
		const cleanedEntry: { [key: string]: string } = {};
		for (const key in entry) {
			const value = entry[key];

			// remove unwanted values while ensuring a valid object structure
			cleanedEntry[key] =
				typeof value === "string" && value.trim() !== ""
					? value
					: "Unknown";
		}
		return cleanedEntry;
	});

	// determine chart type for each question
	determineChartTypes();
});

// determine which chart type each question should use
const determineChartTypes = () => {
	if (!rawData.value.length) return;

	const firstRow = rawData.value[0];
	const questionKeys = Object.keys(firstRow);

	questionKeys.forEach((question) => {
		// get config for this question
		const config = chartConfig[question];

		// chart type is set
		if (config === "exclude") {
			chartTypes.value[question] = null; // exclude this chart
		} else if (config) {
			chartTypes.value[question] = config; // use set chart type
		}

		// fallback to default logic (based on unique answers)
		else {
			const uniqueAnswers = new Set(
				rawData.value.map((d) => d[question])
			);
			if (uniqueAnswers.size >= 12) {
				chartTypes.value[question] = "bar";
			} else {
				chartTypes.value[question] = "pie";
			}
		}
	});
};

// filtered data
const filteredData = computed(() => {
	if (!activeFilter.value) return rawData.value;
	return rawData.value.filter(
		(d) => d[activeFilter.value!.questionKey] === activeFilter.value!.value
	);
});

// filter data
const filterData = (questionKey: string, value: any) => {
	activeFilter.value =
		activeFilter.value?.value === value ? null : { questionKey, value };
};

// nuxt echarts setup
import type { InitOptions } from "nuxt-echarts/runtime/types";
const initOptions = computed<InitOptions>(() => ({
	height: 600,
	width: 900,
	renderer: "canvas",
	locale: "EN",
}));
provide(INIT_OPTIONS_KEY, initOptions);
</script>

<template>
	<div class="h-screen w-screen">
		<div
			class="flex flex-col text-align-center items-center justify-center gap-y-5 my-5"
		>
			<!-- title -->
			<span class="text-bold text-gray-500 text-5xl font-bold mt-5"
				>Pokelawls Census 2025</span
			>

			<!-- reset Filter Button -->
			<button
				@click="activeFilter = null"
				:disabled="activeFilter == null"
				:class="[
					'my-5 px-4 py-2 rounded',
					activeFilter == null ? 'bg-gray-300' : 'bg-green-400',
				]"
			>
				Reset Filters
			</button>

			<!-- charts -->
			<div class="flex flex-col gap-y-20">
				<!-- dynamically render charts based on chart type -->
				<template
					v-for="(chartType, question) in chartTypes"
					:key="question"
				>
					<BarChart
						v-if="chartType === 'bar'"
						:question="(question as string)"
						:data="filteredData"
						@filter="filterData"
					/>
					<PieChart
						v-else-if="chartType === 'pie'"
						:question="(question as string)"
						:data="filteredData"
						@filter="filterData"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<style>
body {
	font-family: "Open Sans";
	@apply bg-white text-gray-500;
}
</style>
