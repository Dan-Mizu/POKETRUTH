<script setup lang="ts">
// initial avatar properties
const color: Ref<string> = ref("#55ff00");
const eyeType: Ref<string> = ref("normal");
const equippedItem: Ref<string> = ref("");

// data
import items from "assets/data/items.json";
const eyes = ["normal", "happy", "sad", "sassy"];
</script>

<template>
	<div
		class="flex flex-col gap-y-10 justify-center items-center h-screen w-screen"
	>
		<!-- Avatar -->
		<div class="relative flex items-end justify-center w-[449px] h-[342px]">
			<!-- Accessories -->
			<div class="absolute">
				<div
					class="select-none pointer-events-none relative w-[449px] h-[342px]"
				>
					<!-- Accessory -->
					<img
						v-if="equippedItem"
						:src="`/avatar/accessories/2.5x/${equippedItem}.png`"
						class="absolute z-[3]"
					/>
				</div>
			</div>

			<!-- Body -->
			<div class="absolute">
				<div
					class="select-none pointer-events-none relative w-[320px] h-[232px]"
				>
					<!-- Belly -->
					<img
						src="/avatar/body/2.5x/Non-Tintable.png"
						class="absolute z-[1]"
					/>

					<!-- Eyes -->
					<img
						:src="`/avatar/eyes/2.5x/${eyeType}.png`"
						class="absolute z-[2]"
					/>

					<!-- Tint-able Skin -->
					<div
						class="text-[320px] overflow-hidden relative select-none z-0"
					>
						<!-- Tint -->
						<div
							class="absolute left-[-1em] opacity-50"
							:style="{
								filter: 'drop-shadow(1em 0 0px ' + color + ')',
							}"
						>
							<img src="/avatar/body/2.5x/Tintable.png" />
						</div>

						<!-- Base -->
						<img src="/avatar/body/2.5x/Tintable.png" />
					</div>
				</div>
			</div>
		</div>

		<!-- Color Picker -->
		<div>
			<ColorPickerHSL
				:color="color"
				@colorChanged="(newColor) => (color = newColor)"
			/>
		</div>

		<!-- Options -->
		<div
			class="flex flex-col gap-y-4 px-10 w-full items-center justify-center"
		>
			<!-- Eye Types -->
			<div class="flex gap-1 flex-wrap">
				<div
					v-for="eye in eyes"
					class="bg-gray-800 rounded-lg w-20 h-20 flex items-center justify-center hover:bg-opacity-80 select-none"
					@click="() => (eyeType = eye)"
				>
					<img :src="`/avatar/eyes/UI/${eye}.png`" />
				</div>
			</div>

			<!-- Accessories -->
			<div class="flex gap-1 flex-wrap">
				<div
					class="bg-gray-800 rounded-lg w-20 h-20 flex items-center justify-center hover:bg-opacity-80 select-none"
					@click="() => (equippedItem = '')"
				/>
				<div
					v-for="(item, key) in items"
					class="bg-gray-800 rounded-lg w-20 h-20 flex items-center justify-center hover:bg-opacity-80 select-none"
					@click="() => (equippedItem = key)"
				>
					<img :src="`/avatar/accessories/UI/${key}.png`" />
				</div>
			</div>
		</div>
	</div>
</template>
