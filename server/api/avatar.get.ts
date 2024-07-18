import { firebase } from "../utils/firebase";

export default defineEventHandler(async (event) => {
	// get query
	const { accessToken } = getQuery(event);

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
			statusMessage: "Unable to retrieve Twitch user.",
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
			color: 917248,
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
});
