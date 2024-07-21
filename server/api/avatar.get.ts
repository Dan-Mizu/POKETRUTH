import { ApiClient } from "@twurple/api";
import { firebase } from "../utils/firebase";
import integerToHex from "../utils/integerToHex";

export default defineEventHandler(async (event) => {
	// get query
	const { accessToken, name } = getQuery(event);

	// get own user
	if (accessToken) {
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
			// save twitch user data
			if (response && (response as { data: any }).data)
				return (response as { data: any }).data[0];
		});

		// no twitch user found
		if (!twitchUser)
			throw createError({
				statusCode: 500,
				statusMessage: "Unable to retrieve Twitch user",
			});

		// get peepo pond user
		let pondUser: IPeepoPondUser | null = null;
		if (twitchUser) {
			await firebase
				.ref(`users/${twitchUser.id}`)
				.once("value", function (snapshot) {
					pondUser = snapshot.val() as IPeepoPondUser;
				});
		}

		// return pond user data
		if (pondUser && (pondUser as IPeepoPondUser).character) {
			// convert color data from (old) integer to (new) hex code format
			if (Number.isFinite((pondUser as IPeepoPondUser).character.color)) {
				(pondUser as IPeepoPondUser).character.color = integerToHex(
					(pondUser as IPeepoPondUser).character
						.color as unknown as number
				);
			}

			// format and return
			return {
				data: {
					id: Number(twitchUser.id),
					display_name: twitchUser.display_name,
					character: (pondUser as IPeepoPondUser).character,
					inventory: (pondUser as IPeepoPondUser).inventory,
				},
			} as { data: IAvatar };
		}

		// create new user
		else {
			// default
			let character = {
				color: "#55FF00",
				eye_type: "normal",
			};

			// update
			var updates: { [key: string]: any } = {};
			updates["/users/" + twitchUser.id + "/character"] = character;
			await firebase.ref().update(updates);

			return {
				data: {
					id: Number(twitchUser.id),
					display_name: twitchUser.display_name,
					character: character,
				},
			} as { data: IAvatar };
		}
	}

	// get requested user
	else if (name) {
		// get twitch api (twurple) client
		const twitchAPI: ApiClient = event.context.twitchAPI;

		// failed to connect
		if (!twitchAPI)
			throw createError({
				statusCode: 500,
				statusMessage: "Unable to reach Twitch API",
			});

		// get twitch user
		const twitchUser = await twitchAPI.users.getUserByName(name as string);

		// get peepo pond user
		let pondUser: IPeepoPondUser | null = null;
		if (twitchUser) {
			await firebase
				.ref("users/" + twitchUser.id)
				.once("value", function (snapshot) {
					pondUser = snapshot.val() as IPeepoPondUser;
				});
		}

		// no twitch user found
		else
			throw createError({
				statusCode: 500,
				statusMessage: "Unable to retrieve Twitch user",
			});

		// return pond user data
		if (pondUser && (pondUser as IPeepoPondUser).character) {
			// type cast
			pondUser = pondUser as IPeepoPondUser;

			// convert color data from (old) integer to (new) hex code format
			if (Number.isFinite(pondUser.character.color)) {
				pondUser.character.color = integerToHex(
					pondUser.character.color as unknown as number
				);
			}

			// format and return
			return {
				data: {
					id: Number(twitchUser.id),
					display_name: twitchUser.displayName,
					character: pondUser.character,
					inventory: pondUser.inventory,
				},
			} as { data: IAvatar };
		}

		// no peepo pond user found
		else {
			// return default avatar
			return {
				statusCode: 500,
				statusMessage: "Unable to retrieve Peepo Pond user",
				data: {
					id: Number(twitchUser.id),
					display_name: twitchUser.displayName,
					character: {
						color: "#55FF00",
						eye_type: "normal",
					},
				},
			} as { data: IAvatar; statusCode: number; statusMessage: string };
		}
	}
});
