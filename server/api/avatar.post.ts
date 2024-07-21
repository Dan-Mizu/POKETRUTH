import { firebase } from "../utils/firebase";
import isHexColor from "../utils/isHexColor";

export default defineEventHandler(async (event) => {
	// get query
	const { accessToken, character } = getQuery(event);

	// required param
	let newCharacter: IAvatarCharacter = JSON.parse(character as string);
	if (!newCharacter)
		throw createError({
			statusCode: 400,
			statusMessage: "No new character data was supplied",
		});

	// get twitch app client ID
	const clientId = useRuntimeConfig().public.twitchAppClientId;

	// get twitch user
	const twitchUser: ITwitchUser = await $fetch(
		"https://api.twitch.tv/helix/users",
		{
			headers: {
				Authorization: "Bearer " + accessToken,
				"Client-Id": clientId,
			},
		}
	).then((response) => {
		// return twitch user data
		if (response) {
			let { data } = response as { data: any };
			return data[0];
		}
	});

	// no twitch user found
	if (!twitchUser)
		throw createError({
			statusCode: 500,
			statusMessage: "Unable to retrieve Twitch user",
		});

	// get pond user
	let pondUser: IPeepoPondUser | null = null;
	await firebase
		.ref(`users/${twitchUser.id}`)
		.once("value", function (snapshot) {
			pondUser = snapshot.val() as IPeepoPondUser;
		});

	// no pond user found
	if (!pondUser)
		throw createError({
			statusCode: 500,
			statusMessage: "Unable to retrieve Peepo Pond user",
		});
	else pondUser = pondUser as IPeepoPondUser;

	// verify user owns all new accessories
	let newAccessory = newCharacter.accessory;
	if (newAccessory && pondUser) {
		// get inventory
		let inventory = pondUser.inventory;

		// user does not own new accessory
		if (
			inventory &&
			inventory.accessory &&
			!inventory.accessory[newAccessory]
		)
			throw createError({
				statusCode: 500,
				statusMessage: "Failed to apply changes",
			});
	}

	// verify color
	let newColor = newCharacter.color as string | number | undefined;
	if (newColor)
		if (!(typeof newColor === "string" && isHexColor(newColor))) {
			// convert color data from (old) integer to (new) hex code format
			if (Number.isFinite(newColor)) {
				newCharacter.color = integerToHex(
					newColor as unknown as number
				);
			}
			// reset color to default
			else newCharacter.color = "#55FF00";
		}

	// final character data
	let finalCharacter = { ...pondUser.character, ...newCharacter };

	// defaults
	if (!finalCharacter.color) finalCharacter.color = "#55FF00";
	if (!finalCharacter.eye_type) finalCharacter.eye_type = "normal";

	// update
	var updates: { [key: string]: any } = {};
	updates["/users/" + twitchUser.id + "/character"] = newCharacter;
	await firebase
		.ref()
		.update(updates, () => setResponseStatus(event, 201, "Avatar Updated"));
});
