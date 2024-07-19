<script setup lang="ts">
// notifications
const toast = useToast();

import type { NuxtError } from "#app";
// data
import items from "assets/data/items.json";
const eyes = ["normal", "happy", "sad", "sassy"];

// user data
let avatarData: Ref<IAvatar | null> = ref(null);
const color: Ref<string> = ref("#55ff00");
const eye_type: Ref<string> = ref("normal");
const accessory: Ref<string> = ref("");

// state
let readonly_mode: Ref<boolean> = ref(false);
let accessToken: Ref<string> = ref("");
let avatar_state: Ref<"loading" | "loaded"> = ref("loading");
let save_state: Ref<"saving" | "no_changes" | "saveable"> = ref("no_changes");
let active: ComputedRef<boolean> = computed(() => {
	return avatar_state.value == "loaded" && save_state.value != "saving";
});

// get route query (if redirected back from authenticating with twitch)
const route = useRoute();
onMounted(async () => {
	// success state for notifications
	let avatarLoaded: boolean | null = null;

	// check for avatar query
	if (route.params.name) {
		// request avatar data from server
		await $fetch("/api/avatar", {
			query: {
				name: route.params.name,
			},
		})
			.then((response: any) => {
				if (response) {
					// change to readonly mode
					readonly_mode.value = true;

					// save avatar data
					avatarData.value = response.data;

					// update avatar data
					if (avatarData.value && avatarData.value.character) {
						if (
							avatarData.value.inventory &&
							avatarData.value.character.accessory
						)
							accessory.value =
								avatarData.value.character.accessory;
						if (avatarData.value.character.eye_type)
							eye_type.value =
								avatarData.value.character.eye_type;
						if (avatarData.value.character.color)
							color.value = integerToHex(
								avatarData.value.character.color
							);
					}

					// peepo pond user not found
					if (response.statusCode == 500) {
						// default avatar
						avatarLoaded = null;

						// notification
						toast.add({
							title: "No frog found for this user",
							icon: "i-heroicons-x-circle-20-solid",
							color: "red",
							ui: {
								background: "bg-white dark:bg-gray-950",
							},
						});
					}
					// success
					else avatarLoaded = true;
				}
			})
			.catch((error: NuxtError) => {
				// log
				console.log(error.statusCode, error.statusMessage);

				// failed
				avatarLoaded = false;
			});
	}

	// check for twitch api access token
	else if (!route.query.error && route.hash) {
		// user avatar not loaded yet
		avatarLoaded = false;

		// token
		accessToken.value = route.hash.split("&")[0].slice(14);

		// clear hash
		useRouter().push(route.path.split("#")[0]);

		// get peepo pond user data
		await $fetch("/api/avatar", {
			query: {
				accessToken: accessToken.value,
			},
		}).then((response) => {
			// save avatar data
			if (response) avatarData.value = response.data;

			// update avatar data
			if (avatarData.value && avatarData.value.character) {
				if (
					avatarData.value.inventory &&
					avatarData.value.character.accessory
				)
					accessory.value = avatarData.value.character.accessory;
				if (avatarData.value.character.eye_type)
					eye_type.value = avatarData.value.character.eye_type;
				if (avatarData.value.character.color)
					color.value = integerToHex(
						avatarData.value.character.color
					);

				avatarLoaded = true;
			}

			// watch for changes
			watch(color, () => (save_state.value = "saveable"));
			watch(eye_type, () => (save_state.value = "saveable"));
			watch(accessory, () => (save_state.value = "saveable"));
		});
	}
	// twitch api error
	else if (route.query.error) avatarLoaded = false;

	// notification
	if (avatarLoaded)
		toast.add({
			title: "Loaded frog",
			icon: "i-heroicons-check-circle-20-solid",
			color: "green",
			ui: {
				background: "bg-white dark:bg-gray-950",
			},
		});
	else if (avatarLoaded !== null)
		toast.add({
			title: "Failed to load frog",
			icon: "i-heroicons-x-circle-20-solid",
			color: "red",
			ui: {
				background: "bg-white dark:bg-gray-950",
			},
		});

	// loaded
	avatar_state.value = "loaded";
});

// update character
const updateCharacter = async () => {
	// change state
	save_state.value = "saving";

	// update
	await $fetch("/api/avatar", {
		method: "POST",
		query: {
			accessToken: accessToken.value,
			character: {
				accessory: accessory.value,
				eye_type: eye_type.value,
				color: hexToInteger(color.value),
			},
		},
	})
		// success
		.then(() => {
			// notification
			toast.add({
				title: "Saved frog",
				icon: "i-heroicons-check-circle-20-solid",
				color: "green",
				ui: {
					background: "bg-white dark:bg-gray-950",
				},
			});
		})
		// failed
		.catch((error: NuxtError) => {
			if (error.statusCode != 201)
				// notification
				toast.add({
					title: "Failed to save frog",
					icon: "i-heroicons-x-circle-20-solid",
					color: "red",
					ui: {
						background: "bg-white dark:bg-gray-950",
					},
				});
		});

	// change state
	save_state.value = "no_changes";
};
</script>

<template>
	<!-- Main -->
	<div
		class="w-full h-full flex items-start justify-center overflow-y-scroll overflow-x-hidden"
	>
		<!-- Content -->
		<div
			class="flex flex-col gap-y-5 justify-center items-center w-[449px] h-full py-10"
		>
			<!-- Avatar -->
			<div
				v-if="avatar_state == 'loaded'"
				class="relative flex items-end justify-center w-[449px] h-[342px]"
			>
				<!-- Accessories -->
				<div class="absolute">
					<div
						class="select-none pointer-events-none relative w-[449px] h-[342px]"
					>
						<!-- Accessory -->
						<img
							v-if="accessory"
							:src="`/avatar/accessories/2.5x/${accessory}.png`"
							class="absolute z-[3]"
							draggable="false"
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
							draggable="false"
						/>

						<!-- Eyes -->
						<img
							:src="`/avatar/eyes/2.5x/${eye_type}.png`"
							class="absolute z-[2]"
							draggable="false"
						/>

						<!-- Tintable Skin -->
						<div
							class="text-[320px] overflow-hidden relative select-none z-0"
						>
							<!-- Tint -->
							<div
								class="absolute left-[-1em] mix-blend-multiply"
								:style="{
									filter:
										'drop-shadow(1em 0 0px ' + color + ')',
								}"
							>
								<img
									src="/avatar/body/2.5x/Tintable.png"
									draggable="false"
								/>
							</div>

							<!-- Base -->
							<img
								src="/avatar/body/2.5x/Tintable.png"
								draggable="false"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading Avatar -->
			<div
				v-else
				class="flex items-center justify-center w-full h-[342px]"
			>
				<img src="/images/ppCircle.webp" draggable="false" />
			</div>

			<!-- Twitch Integration -->
			<UButton
				v-if="!avatarData && !readonly_mode"
				color="purple"
				rounded
				:disabled="avatar_state != 'loaded'"
				:to="
					avatar_state == 'loaded'
						? 'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=' +
						  useRuntimeConfig().public.twitchAppClientId +
						  '&redirect_uri=' +
						  useRequestURL().origin +
						  '/avatar'
						: undefined
				"
			>
				<span
					class="text-white text-center text-lg flex items-center justify-center gap-x-2"
				>
					<NuxtIcon name="simple-icons:twitch" />
					<span>Sign In To Twitch</span>
				</span>
			</UButton>

			<!-- Logged In -->
			<div
				v-else-if="avatarData"
				class="flex flex-col items-center justify-center gap-y-2"
			>
				<!-- Name -->
				<span class="text-white text-2xl">
					{{ avatarData.display_name }}
				</span>

				<!-- Save Avatar Changes -->
				<div v-if="!readonly_mode">
					<UButton
						color="green"
						label="Save"
						:disabled="save_state != 'saveable'"
						:loading="save_state == 'saving'"
						@click="updateCharacter"
					/>
				</div>
			</div>

			<!-- Options -->
			<template v-if="!readonly_mode">
				<!-- Color Picker -->
				<div>
					<ColorPickerHSL
						:color="color"
						@colorChanged="(newColor: string) => (color = newColor)"
						:disabled="!active"
					/>
				</div>

				<!-- Cosmetics -->
				<div
					class="flex flex-col gap-y-4 w-full items-center justify-center"
				>
					<!-- Eye Types -->
					<div class="flex gap-1 flex-wrap justify-center">
						<div
							v-for="eye in eyes"
							:class="[
								'w-20 h-20 flex items-center justify-center hover:bg-opacity-80 bg-gray-400 rounded-lg border-white border-[1px] select-none',
								!active
									? ' pointer-events-none opacity-20'
									: '',
							]"
							@click="() => (eye_type = eye)"
						>
							<img :src="`/avatar/eyes/UI/${eye}.png`" />
						</div>
					</div>

					<!-- Accessories -->
					<div class="flex gap-1 flex-wrap justify-center">
						<!-- All Accessories -->
						<template v-if="!avatarData">
							<!-- No Accessory Option -->
							<div
								:class="[
									'w-20 h-20 flex items-center justify-center hover:bg-opacity-80 bg-gray-400 rounded-lg border-white border-[1px] select-none',
									!active
										? ' pointer-events-none opacity-20'
										: '',
								]"
								@click="() => (accessory = '')"
							/>

							<div
								v-for="(item, key) in items"
								:class="[
									'w-20 h-20 flex items-center justify-center hover:bg-opacity-80 bg-gray-400 rounded-lg border-white border-[1px] select-none',
									!active
										? ' pointer-events-none opacity-20'
										: '',
								]"
								@click="() => (accessory = key)"
							>
								<img
									:src="`/avatar/accessories/UI/${key}.png`"
								/>
							</div>
						</template>

						<!-- Owned Accessories -->
						<template
							v-else-if="avatarData.inventory && avatarData.inventory.accessory && Object.keys(avatarData.inventory.accessory as Object).length > 0"
						>
							<!-- No Accessory Option -->
							<div
								:class="[
									'w-20 h-20 flex items-center justify-center hover:bg-opacity-80 bg-gray-400 rounded-lg border-white border-[1px] select-none',
									!active
										? ' pointer-events-none opacity-20'
										: '',
								]"
								@click="() => (accessory = '')"
							/>

							<div
								v-for="(item, key) in avatarData.inventory
									.accessory"
								:class="[
									'w-20 h-20 flex items-center justify-center hover:bg-opacity-80 bg-gray-400 rounded-lg border-white border-[1px] select-none',
									!active
										? ' pointer-events-none opacity-20'
										: '',
								]"
								@click="() => (accessory = key as string)"
							>
								<img
									:src="`/avatar/accessories/UI/${key}.png`"
								/>
							</div>
						</template>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
