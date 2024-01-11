<script setup lang="ts">
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
	<audio id="backgroundMusic" loop autoPlay defaultValue="{0.25}">
		<source src="/audio/music/jebaited.ogg" type="audio/ogg" />
	</audio>
	<div class="flex flex-col h-screen justify-center items-center gap-y-4">
		<a
			href="https://www.youtube.com/watch?v=d1YBv2mWll0"
			target="_blank"
			rel="noopener noreferrer"
			><img src="/images/jebaited.webp"
		/></a>
		<p class="text-6xl">YOU GOT JEBAITED</p>
		<a href="/"
			><p class="underline decoration-dashed hover:decoration-solid">
				click of shame >
			</p></a
		>
	</div>
</template>
