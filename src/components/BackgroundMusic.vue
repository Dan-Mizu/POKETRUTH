<script setup lang="ts">
// properties
const props = defineProps<{
	music: string;
}>();

// play music
if (import.meta.client) {
	// get music player
	let music = document.getElementById("backgroundMusic") as HTMLAudioElement

	// set volume
	music.volume = 0.2

	// play (and defer if not allowed to by browser)
	music.play()
		.catch((_error) => {
			document.addEventListener(
				"click",
				() => {
					(
						document.getElementById(
							"backgroundMusic"
						) as HTMLAudioElement
					).play();
				},
				{ once: true }
			);
		});
}
</script>

<template>
	<!-- Music -->
	<audio id="backgroundMusic" loop autoPlay defaultValue="{0.25}">
		<source :src="props.music" type="audio/ogg" />
	</audio>
</template>
