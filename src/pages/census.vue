<script setup lang="ts">
// chart config
const chartConfig: {
	[key: string]: {
		type?:
			| null
			| "exclude"
			| "bar"
			| "pie"
			| "word-cloud"
			| "north-america-map"
			| "europe-map";
		multipleChoice?: boolean;
		answerOrder?: string[];
	};
} = {
	Timestamp: { type: "exclude" },
	"If you are in North America, which state / country / territory do you currently live:":
		{ type: "north-america-map" },
	"If you are in Europe, which country / territory do you currently live:": {
		type: "europe-map",
	},
	"How often do you get high?": {
		answerOrder: [
			"Always",
			"A few times a day",
			"Once a day",
			"A few times a week",
			"A few times a month",
			"A few times a year",
			"Tried and quit",
			"Never tried it",
		],
	},
	"Do you have any pets?": {
		multipleChoice: true,
	},
	"Of viewers who get high, here are their prefered methods:": {
		multipleChoice: true,
	},
	"How do you discover that Poke is live? Check all that apply": {
		multipleChoice: true,
	},
	"How do you watch Poke? Check all that apply.": {
		multipleChoice: true,
	},
	"What aspects of Poke and his stream do you enjoy the most?": {
		type: "word-cloud",
	},
	"What content do you want to see more of in the future of this channel?": {
		type: "word-cloud",
	},
	"When making music content, is there a specifc genre you like seeing Poke experiment with? Any new genres that you think would make for a entertaining stream?":
		{ type: "word-cloud" },
	"Excluding Poke, Gigi and ekoP; who is your favorite twitch streamer?": {
		type: "word-cloud",
	},
	"What game do you most want to see Poke play in the future?": {
		type: "word-cloud",
	},
	"Who do you most want to see collab with Poke in the future?": {
		type: "word-cloud",
	},
	"What is your favorite emote on Twitch? 7tv, BTTV, FFZ are included": {
		type: "word-cloud",
	},
	"What is your favorite video game of all time?": { type: "word-cloud" },
	"What is your favorite movie of all time?": { type: "word-cloud" },
	"Who are your favorite music artists / bands?": { type: "word-cloud" },
	"What is your favorite album of all time?": { type: "word-cloud" },
	"What is your favorite food?": { type: "word-cloud" },
	"If you have any suggestions for improvements to the Census in following years please feel free to give that feedback here. ":
		{ type: "word-cloud" },
};

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
const activeFilter: Ref<{ questionKey: string; value: string } | null> =
	ref(null); // tracks active filter
const chartTypes = ref<{
	[key: string]:
		| null
		| "bar"
		| "pie"
		| "word-cloud"
		| "north-america-map"
		| "europe-map";
}>({}); // mapping of questions to chart types
onMounted(async () => {
	// determine chart type for each question
	determineChartTypes();
});

// determine which chart type each question should use
const determineChartTypes = () => {
	// census data exists?
	if (!censusData.length) return;

	// get the questions (column names)
	const firstRow = censusData[0];
	const questionKeys = Object.keys(firstRow);

	// determine chart for each question
	questionKeys.forEach((question) => {
		// get config for this question
		const config = chartConfig[question];

		// init amount of unique answers
		let uniqueAnswers: Set<string | number>;

		// chart has set type
		if (config && config.type) {
			chartTypes.value[question] =
				// if set to exclude, make sure chart does not show up
				config.type !== "exclude" ? config.type : null;
			return;
		}

		// is set to multiple choice
		else if (config && config.multipleChoice) {
			uniqueAnswers = new Set(
				censusData.flatMap((d) =>
					typeof d[question] === "string"
						? d[question]?.split(",").map((ans) => ans.trim()) ?? []
						: []
				)
			);
		}

		// fallback to default logic
		else uniqueAnswers = new Set(censusData.map((d) => d[question]));

		// determine chart by amount of unique answers
		if (uniqueAnswers.size >= 12) {
			chartTypes.value[question] = "bar";
		} else {
			chartTypes.value[question] = "pie";
		}
	});
};

// filtered data
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

// filter data
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
	<div
		v-if="Object.keys(chartTypes).length > 0"
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
				v-for="(chartType, question, index) in chartTypes"
				:key="(question as string)"
			>
				<!-- only load charts with valid questions and in viewport -->
				<div
					class="chart-container fade-in"
					:id="(question as string)"
					ref="charts"
				>
					<BarChart
						v-if="chartType === 'bar'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
						:answerOrder="chartConfig[question]?.answerOrder"
					/>
					<PieChart
						v-else-if="chartType === 'pie'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
						:answerOrder="chartConfig[question]?.answerOrder"
					/>
					<MapChart
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
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
					/>
					<WordCloudChart
						v-else-if="chartType === 'word-cloud'"
						:question="(question as string)"
						:data="filteredData"
						:multipleChoice="chartConfig[question]?.multipleChoice"
						@filter="filterData"
					/>
				</div>
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
