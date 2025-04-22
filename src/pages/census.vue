<script setup lang="ts">
// get viewport size
const viewport = useViewport();

// auto import commentary components
const modules = import.meta.glob("~/components/Commentary/*.vue", {
	eager: true,
});
const commentaryComponents = Object.fromEntries(
	Object.entries(modules).map(([path, mod]) => {
		// extract component name from file name
		const name = path.split("/").pop()?.replace(".vue", "") ?? "";
		return [name, (mod as any).default];
	})
);

// nuxt echarts setup
import type { InitOptions } from "nuxt-echarts/runtime/types";
import WordCloudChart from "~/components/Charts/WordCloudChart.vue";
const initOptions = computed<InitOptions>(() => ({
	autoResize: true,
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
const activeFilter: Ref<{
	questionKey: string;
	value: string | number;
} | null> = ref(null);
const filteredData = computed(() => {
	// no filter
	if (!activeFilter.value) return censusData;

	// get current filter
	const { questionKey, value } = activeFilter.value;

	// filter data
	return censusData.filter((row) => {
		const answer = String(row[questionKey]);

		// multiple-choice question, check if the selected value is in the answer
		if (
			typeof value === "string" &&
			chartConfig[questionKey]?.multipleChoice
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
		// observe each chart element
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

	<!-- top toolbar -->
	<div class="z-[11] fixed w-full top-3 flex justify-end my-2 sm:px-10 px-5">
		<!-- dark mode button -->
		<ToggleThemeButton />
	</div>

	<!-- census data visualization -->
	<div
		v-show="charts.length > 0"
		class="w-full flex flex-col gap-y-10 items-center justify-center text-center text-align-center my-5 px-8 sm:px-32 overflow-x-hidden"
	>
		<!-- header commentary -->
		<HeaderCommentary />

		<!-- spacing -->
		<div class="h-20" />

		<!-- charts -->
		<div
			class="w-full flex flex-col flex-shrink gap-y-20 items-center justify-center"
		>
			<!-- dynamically render charts based on chart type -->
			<template
				v-for="(chartMeta, question) in chartConfig"
				:key="(question as string)"
				class="w-full flex flex-col items-center justify-center"
			>
				<!-- fade in charts when in viewport, and ignore non-specified charts -->
				<div
					v-if="chartMeta.type"
					class="w-full flex flex-col items-center justify-center text-center fade-in"
					ref="charts"
				>
					<!-- chart (shows one of the following) -->
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
					<RatingChart
						v-else-if="chartMeta.type === 'rating'"
						:question="(question as string)"
						:data="filteredData"
						@filter="filterData"
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

					<!-- chart commentary -->
					<component
						v-if="chartMeta.commentaryComponent"
						:is="
							commentaryComponents[chartMeta.commentaryComponent]
						"
						class="pb-10 w-full"
					/>
				</div>
			</template>
		</div>

		<!-- spacing -->
		<div class="h-5" />

		<!-- footer commentary -->
		<FooterCommentary />

		<!-- spacing -->
		<div class="h-16" />
	</div>

	<!-- gag -->
	<div
		v-show="gagActive"
		class="z-20 fixed top-0 left-0 w-screen h-screen flex items-center justify-center px-10"
	>
		<!-- image -->
		<NuxtImg src="images/wajaja.png" class="h-[80%]" draggable="false" />
	</div>

	<!-- tool bar -->
	<div
		v-show="activeFilter"
		class="z-10 fixed w-full bottom-3 flex justify-end sm:px-10 px-5"
	>
		<!-- filter button -->
		<div class="h-10 text-white flex gap-x-1 items-center justify-center">
			<!-- BAN RESPONDERS FROM CHAT gag button -->
			<button
				v-if="
					gagActive === null && viewport.isGreaterOrEquals('tablet')
				"
				@click="clickedGagButton"
				class="h-full min-w-12 px-2 pt-[0.4rem] rounded-full bg-red-500 hover:bg-red-400 font-bold flex gap-x-1"
			>
				<NuxtIcon
					name="solar:sledgehammer-bold"
					class="h-6 w-6 mt-[0.05rem]"
				/>
				<span
					class="h-full pr-2 whitespace-nowrap overflow-ellipsis text-base"
				>
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
				<span
					class="h-full pr-2 whitespace-nowrap overflow-ellipsis text-base"
				>
					{{ activeFilter?.value ? activeFilter?.value : "None" }}
				</span>
			</button>

			<!-- close button -->
			<button
				@click="activeFilter = null"
				title="Remove Filter"
				class="sm:h-[80%] h-full aspect-square rounded-full bg-gray-500 dark:bg-gray-100 hover:bg-gray-400 flex items-center justify-center"
			>
				<NuxtIcon
					name="material-symbols:close-small-rounded"
					class="h-6 w-6 dark:text-gray-500"
				/>
			</button>
		</div>
	</div>
</template>

<style>
html {
	scroll-behavior: smooth;
}

body {
	@apply bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300 transition-colors;
}

.fade-in {
	opacity: 0;
	transition: opacity 0.25s ease-in-out;
}

.fade-in.visible {
	opacity: 1;
}
</style>
