<script setup lang="ts">
const videos = [
	{
		title: "poke laughs as millions perish",
		src: "/video/florida.mp4",
	},
	{
		title: "violent tendencies???",
		src: "/video/violent.mp4",
	},
	{
		title: "raceist?",
		src: "/video/needRacism.mp4",
	},
];
const videoIndex = ref(0);

const changeVideoIndex = (change: number) => {
	videoIndex.value =
		(videoIndex.value + videos.length + change) % videos.length;
};
</script>

<template>
	<div class="flex justify-center items-center h-screen flex-col gap-y-20">
		<!-- heading -->
		<div class="text-center flex flex-col gap-y-4">
			<p class="text-3xl font-bold">
				poketruth.info has been hijacked by GROUP HAT3-WATCH3RZ®
			</p>
			<p>
				its time to expose the so called "pokelawls"... his real
				name?... JORGE... KARAM &lt;- (HARAM?)
			</p>
		</div>

		<!-- videos -->
		<div class="flex flex-col gap-y-3">
			<div class="flex">
				<div
					class="flex flex-[0.2] px-2 items-center justify-center text-3xl font-bold mr-5"
				>
					<button @click="changeVideoIndex(-1)">&lt;</button>
				</div>
				<div class="flex flex-col text-center gap-y-3">
					<p class="text-xl">{{ videos[videoIndex].title }}</p>
					<video controls width="800" :key="videos[videoIndex].src">
						<source
							:src="videos[videoIndex].src"
							type="video/mp4"
						/>
					</video>
				</div>
				<div
					class="flex flex-[0.2] px-2 items-center justify-center text-3xl font-bold ml-5"
				>
					<button @click="changeVideoIndex(1)">></button>
				</div>
			</div>
			<ul
				class="flex w-full justify-center items-center text-center gap-x-1"
			>
				<li v-for="index in videos.length">
					<span
						:class="[
							videoIndex === index - 1
								? 'text-lime-400'
								: 'text-gray-500',
						]"
						>•</span
					>
				</li>
			</ul>
		</div>
	</div>
</template>
