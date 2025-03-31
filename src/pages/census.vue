<script setup lang="ts">
// csv data file path
const csvFilePath = "/census/2025.csv";

// chart config
const chartConfig: { [key: string]: string } = {
	Timestamp: "exclude",
	"If you are in North America, which state / country / territory do you currently live:":
		"north-america-map",
	"If you are in Europe, which country / territory do you currently live:":
		"europe-map",
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

// use URL hash to scroll to question on load
onUpdated(async () => {
	await nextTick();
	const hash = window.location.hash.replace("#", "").trim();
	if (hash) scrollToQuestion(hash);
});
watch(
	() => window.location.hash,
	(newHash) => {
		const hash = newHash.replace("#", "").trim();
		if (hash) scrollToQuestion(hash);
	}
);

// scroll to specific question on page
const scrollToQuestion = (question: string) => {
	const element = document.getElementById(question);
	if (element) {
		element.scrollIntoView({ behavior: "smooth" });
	}
};

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
	<div
		v-if="rawData.length > 0"
		class="flex flex-col text-align-center items-center justify-center gap-y-5 my-5 text-center"
	>
		<!-- filter button -->
		<div
			class="z-10 fixed w-full bottom-3 flex sm:justify-end justify-center px-10"
		>
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
		</div>

		<!-- title -->
		<span
			class="text-bold text-gray-500 text-3xl sm:text-5xl font-bold pt-5 mx-32"
			>Pokelawls Census 2025</span
		>

		<!-- charts -->
		<div class="flex flex-col gap-y-20">
			<!-- dynamically render charts based on chart type -->
			<template
				v-for="(chartType, question) in chartTypes"
				:key="question"
			>
				<BarChart
					:id="(question as string)"
					v-if="chartType === 'bar'"
					:question="(question as string)"
					:data="filteredData"
					@filter="filterData"
				/>
				<PieChart
					:id="(question as string)"
					v-else-if="chartType === 'pie'"
					:question="(question as string)"
					:data="filteredData"
					@filter="filterData"
				/>
				<MapChart
					:id="(question as string)"
					v-else-if="
						chartType === 'north-america-map' ||
						chartType === 'europe-map'
					"
					:map="
						chartType === 'north-america-map'
							? 'North America'
							: 'Europe'
					"
					:question="(question as string)"
					:data="filteredData"
					@filter="filterData"
				/>
			</template>
		</div>
	</div>

	<!-- loading -->
	<div v-else class="w-screen h-screen flex items-center justify-center">
		<img src="/images/ppCircle.webp" draggable="false" />
	</div>
</template>

<style>
html {
	scroll-behavior: smooth;
}

body {
	font-family: "Open Sans";
	@apply bg-white text-gray-500;
}
</style>
