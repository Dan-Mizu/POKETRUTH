<script setup lang="ts">
// properties
const props = defineProps<{
	music: string;
}>();

// play music
if (process.client) {
	(document.getElementById("backgroundMusic") as HTMLAudioElement)
		.play()
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
