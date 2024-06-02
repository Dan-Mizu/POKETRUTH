<script setup lang="ts">
// register sound
import skullSound from "~/assets/audio/sfx/skull.ogg";
let skull: Ref<HTMLAudioElement | null> = ref(null);
if (process.client) {
	skull.value = new Audio(skullSound);
}
</script>

<template>
	<!-- Music -->
	<BackgroundMusic music="/audio/music/raining_tacos.ogg" />

	<!-- Content -->
	<div
		class="flex justify-center items-center h-screen flex-col gap-y-20 font-underdog"
	>
		<div class="text-center flex flex-col gap-y-8">
			<!-- Heading -->
			<p class="text-5xl font-bold">the xX G SPOTTERS Xx waz here</p>

			<!-- Image -->
			<button @click="skull?.play()">
				<img
					src="/images/gspotters.webp"
					class="w-full"
					draggable="false"
				/>
			</button>
		</div>
	</div>
</template>

<style scoped>
.font-underdog {
	font-family: "Underdog", system-ui;
}
</style>
