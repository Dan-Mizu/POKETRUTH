<script setup lang="ts">
// nuxt echarts setup
import type { InitOptions } from "nuxt-echarts/runtime/types";
import WordCloudChart from "~/components/Charts/WordCloudChart.vue";
const initOptions = computed<InitOptions>(() => ({
	height: 600,
	width: 900,
	renderer: "canvas",
	locale: "EN",
}));
provide(INIT_OPTIONS_KEY, initOptions);

// data references
import rawData from "~/public/data/census/2025.json";
const censusData: CensusSubmission[] = rawData as CensusSubmission[];
import chartMeta from "~/public/data/census/2025-meta.json";
const chartConfig: CensusChartConfig = chartMeta as CensusChartConfig;

// cross filtering data
const activeFilter: Ref<{ questionKey: string; value: string } | null> =
	ref(null);
const filteredData = computed(() => {
	// no filter
	if (!activeFilter.value) return censusData;

	// get current filter
	const { questionKey, value } = activeFilter.value;

	// filter data
	return censusData.filter((d) => {
		const answer = d[questionKey];

		// multiple-choice question, check if the selected value is in the answer
		if (
			chartConfig[questionKey]?.multipleChoice &&
			typeof answer === "string"
		) {
			const answersArray = answer.split(",").map((ans) => ans.trim());

			// check if respondent selected the filtered value
			return answersArray.includes(value);
		}

		// standard single-choice filtering
		return answer === value;
	});
});
const filterData = (questionKey: string, value: any) => {
	activeFilter.value =
		activeFilter.value?.value === value ? null : { questionKey, value };
};

// use URL hash to scroll to question on load and when hash is updated
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

// fade in charts as needed
const charts: Ref<HTMLElement[]> = ref([]);
onMounted(() => {
	nextTick(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry, index) => {
					const chartElement = entry.target;
					if (entry.isIntersecting) {
						chartElement.classList.add("visible");
					} else {
						chartElement.classList.remove("visible");
					}
				});
			},
			{
				threshold: 0.1, // fade-in the chart when 20% of it is in the viewport
			}
		);

		// observe each chart element
		charts.value.forEach((chart) => observer.observe(chart));
	});
});
</script>

<template>
	<!-- loading -->
	<div
		v-if="charts.length <= 0"
		class="w-screen h-screen flex items-center justify-center absolute top-0 left-0 bg-white z-50"
	>
		<img src="/images/ppCircle.webp" draggable="false" />
	</div>

	<!-- charts -->
	<div
		v-show="charts.length > 0"
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
				v-for="(chartMeta, question) in chartConfig"
				:key="(question as string)"
			>
				<!-- only load charts with valid questions and in viewport -->
				<div
					class="chart-container fade-in"
					:id="(question as string)"
					ref="charts"
				>
					<BarChart
						v-if="chartMeta.type === 'bar'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
						:answerOrder="chartConfig[question]?.answerOrder"
					/>
					<PieChart
						v-else-if="chartMeta.type === 'pie'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
						:answerOrder="chartConfig[question]?.answerOrder"
					/>
					<MapChart
						v-else-if="
							chartMeta.type === 'north-america-map' ||
							chartMeta.type === 'europe-map'
						"
						:map="
							chartMeta.type === 'north-america-map'
								? 'North America'
								: 'Europe'
						"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
					/>
					<WordCloudChart
						v-else-if="chartMeta.type === 'word-cloud'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
					/>
				</div>
			</template>
		</div>
	</div>
</template>

<style>
html {
	scroll-behavior: smooth;
}

body {
	@apply bg-white text-gray-500;
}

.fade-in {
	opacity: 0;
	transition: opacity 0.25s ease-in-out;
}

.fade-in.visible {
	opacity: 1;
}
</style>
