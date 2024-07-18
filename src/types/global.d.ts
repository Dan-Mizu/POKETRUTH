// twitch user data
interface ITwitchUser {
	id: string;
	login: string;
	display_name: string;
	type: "admin" | "global_mod" | "staff" | "";
	broadcaster_type: "affiliate" | "partner" | "";
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
	created_at: string;
}

interface IPeepoPondUser {
	character: IAvatarCharacter;
	event:
		| {
				[key: string]: any;
		  }
		| undefined;
	inventory: IAvatarInventory | undefined;
	name: string;
	room: string | undefined;
	stat:
		| {
				firstLogin: number;
				lastLogin: number;
				playTime: number;
		  }
		| undefined;
}

interface IAvatarCharacter {
	accessory: string | undefined;
	color: number | undefined;
	eye_type: string | undefined;
	nameColor: number | undefined;
}

interface IAvatarInventory {
	accessory: { [key: string]: boolean } | undefined;
}

interface IAvatar {
	id: number;
	display_name: string;
	character: IAvatarCharacter;
	inventory: IAvatarInventory;
}
