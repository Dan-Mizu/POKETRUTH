<script setup lang="ts">
// auto import commentary components
const modules = import.meta.glob("~/components/Commentary/*.vue", {
	eager: true,
});
const commentaryComponents = Object.fromEntries(
	Object.entries(modules).map(([path, mod]) => {
		// Extract component name from file name
		const name = path.split("/").pop()?.replace(".vue", "") ?? "";
		return [name, (mod as any).default];
	})
);

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

// gag
let gagActive: Ref<boolean | null> = ref(null);
async function clickedGagButton() {
	// play sound
	let sound = new Audio("/audio/meme/wajaja.ogg");
	sound.volume = 0.2;
	sound.addEventListener("ended", (event) => {
		// end gag
		gagActive.value = false;
	});
	await sound.play();

	// activate gag
	gagActive.value = true;
}
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
		class="flex flex-col text-align-center items-center justify-center text-center gap-y-10 my-5"
	>
		<!-- title -->
		<div
			class="flex flex-col items-center justify-center text-center pt-5 mx-32 gap-y-2"
		>
			<span class="text-3xl sm:text-5xl text-gray-500 font-bold">
				Pokelawls Census 2025
			</span>
			<span class="text-lg sm:text-xl text-gray-300 font">
				(click on a chart to cross-filter other charts)
			</span>
		</div>

		<!-- introduction -->
		<div class="flex flex-col text-start text-xl gap-y-4 mx-32">
			<p>
				Thank you to everyone who responded to our first community
				census.
			</p>
			<p>
				In just a week we received <strong>2,137</strong> responses with
				over <strong>88,000</strong> words written for the open ended
				questions.
			</p>
			<p>
				AI helped some in cleaning up data and trying to make sense of
				all your answers.
			</p>
			<p>Huge thank you to Dan for everything website related. &lt;3</p>
			<p>On with the data!</p>
		</div>

		<!-- spacing -->
		<div class="h-20" />

		<!-- charts -->
		<div class="flex flex-shrink flex-col gap-y-20">
			<!-- dynamically render charts based on chart type -->
			<template
				v-for="(chartMeta, question) in chartConfig"
				:key="(question as string)"
			>
				<!-- fade in charts when in viewport, and ignore non-specified charts -->
				<div
					v-if="chartMeta.type"
					class="chart-container fade-in"
					ref="charts"
				>
					<!-- commentary -->
					<component
						v-if="chartMeta.commentaryComponent"
						:is="
							commentaryComponents[chartMeta.commentaryComponent]
						"
						class="pb-10"
					/>

					<!-- chart -->
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

	<!-- tool bar -->
	<div
		v-show="activeFilter"
		class="z-10 fixed w-full bottom-3 flex sm:justify-end justify-center px-10"
	>
		<!-- filter button -->
		<div class="h-10 text-white flex gap-x-1 items-center justify-center">
			<!-- BAN RESPONDERS FROM CHAT gag button -->
			<button
				v-if="gagActive === null"
				@click="clickedGagButton"
				class="h-full min-w-12 px-2 pt-[0.4rem] rounded-full bg-red-500 hover:bg-red-400 font-bold flex gap-x-1"
			>
				<NuxtIcon
					name="solar:sledgehammer-bold"
					class="h-6 w-6 mt-[0.05rem]"
				/>
				<span class="h-full pr-2 whitespace-nowrap overflow-ellipsis">
					BAN RESPONDERS FROM CHAT
				</span>
			</button>

			<!-- icon and filtering answer -->
			<button
				@click="scrollToQuestion(activeFilter?.questionKey as string)"
				:title="'-> ' + activeFilter?.questionKey"
				class="h-full min-w-12 px-2 pt-[0.4rem] rounded-full bg-green-400 hover:bg-green-300 font-bold flex gap-x-1"
			>
				<NuxtIcon
					name="material-symbols:filter-alt"
					class="h-6 w-6 mt-[0.05rem]"
				/>
				<span class="h-full pr-2 whitespace-nowrap overflow-ellipsis">
					{{ activeFilter?.value ? activeFilter?.value : "None" }}
				</span>
			</button>

			<!-- close button -->
			<button
				@click="activeFilter = null"
				title="Remove Filter"
				class="h-[80%] aspect-square rounded-full bg-gray-500 hover:bg-gray-400 flex items-center justify-center"
			>
				<NuxtIcon
					name="material-symbols:close-small-rounded"
					class="h-6 w-6"
				/>
			</button>
		</div>
	</div>

	<!-- gag -->
	<div
		v-show="gagActive"
		class="z-20 fixed top-0 left-0 w-screen h-screen flex items-center justify-center px-10"
	>
		<!-- image -->
		<NuxtImg src="images/wajaja.png" class="h-[80%]" draggable="false" />
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
