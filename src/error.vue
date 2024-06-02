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
	<!-- Music -->
	<audio id="backgroundMusic" loop autoPlay defaultValue="{0.25}">
		<source src="/audio/music/jebaited.ogg" type="audio/ogg" />
	</audio>

	<!-- Content -->
	<div class="flex flex-col h-screen justify-center items-center gap-y-4">
		<!-- Image -->
		<a
			href="https://www.youtube.com/watch?v=d1YBv2mWll0"
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src="/images/jebaited.webp" />
		</a>

		<!-- Text -->
		<p class="text-6xl">YOU GOT JEBAITED</p>

		<!-- Link -->
		<a href="/">
			<p class="underline decoration-dashed hover:decoration-solid">
				click of shame >
			</p>
		</a>
	</div>

	<!-- Footer -->
	<div
		class="absolute bottom-0 w-screen flex justify-center items-center p-2 text-white text-opacity-40"
	>
		<!-- Music Credits -->
		<span>music by</span>&nbsp;
		<a
			href="https://www.youtube.com/watch?v=d1YBv2mWll0"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="underline decoration-dashed hover:decoration-solid">
				Sordiway & Koaster
			</span>
		</a>
	</div>
</template>
