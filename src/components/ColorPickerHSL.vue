<script setup lang="ts">
// props
const props = defineProps<{
	color: string;
	disabled: boolean;
}>();

// state
const h = ref(265);
const s = ref(100);
const l = ref(50);

// events
const emit = defineEmits(["colorChanged"]);

// computed
const gradientHue = ref(
	computed(() => {
		const stops = [];
		for (let i = 0; i < 7; i++) {
			const hue = i * 60;
			const hsl = hsbToHsl(hue / 360, s.value / 100, l.value / 50);
			stops.push(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
		}
		return {
			backgroundImage: `linear-gradient(to right, ${stops.join(", ")})`,
		};
	})
);
const gradientSaturation = ref(
	computed(() => {
		const stops = [];
		const hsl1 = hsbToHsl(h.value / 360, 0, l.value / 50);
		const hsl2 = hsbToHsl(h.value / 360, 1, l.value / 50);
		stops.push(`hsl(${hsl1.h}, ${hsl1.s}%, ${hsl1.l}%)`);
		stops.push(`hsl(${hsl2.h}, ${hsl2.s}%, ${hsl2.l}%)`);
		return {
			backgroundImage: `linear-gradient(to right, ${stops.join(", ")})`,
		};
	})
);

// update
const updateColor = () =>
	emit("colorChanged", hslToHex(h.value, s.value, l.value));
// init
const initColor = () => {
	let hsl = hexToHsl(props.color);
	h.value = hsl.h;
	s.value = hsl.s;
};
initColor();
</script>

<template>
	<div class="flex flex-col gap-y-2 justify-center items-center">
		<!-- Hue -->
		<div
			:class="[
				'w-full h-5 rounded-full border border-text-color',
				disabled ? 'border-gray-600' : '',
			]"
			:style="gradientHue"
		>
			<input
				class="appearance-none w-full bg-transparent focus:outline-none input-range"
				type="range"
				min="0"
				max="359"
				v-model="h"
				@input="updateColor"
				:disabled="disabled"
			/>
		</div>

		<!-- Saturation -->
		<div
			:class="[
				'w-full h-5 rounded-full border border-text-color',
				disabled ? 'border-gray-600' : '',
			]"
			:style="gradientSaturation"
		>
			<input
				class="appearance-none w-full bg-transparent focus:outline-none input-range"
				type="range"
				min="0"
				max="100"
				v-model="s"
				@input="updateColor"
				:disabled="disabled"
			/>
		</div>
	</div>
</template>

<style scoped>
.input-range[type="range"]::-ms-track {
	width: 100%;
	cursor: pointer;
	background: transparent;
	border-color: transparent;
	color: transparent;
}

.input-range::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: 1px solid #ddd;
	height: 20px;
	width: 20px;
	border-radius: 50px;
	background: #ffffff;
	cursor: pointer;
	box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
	margin-top: -4px;
}
</style>
