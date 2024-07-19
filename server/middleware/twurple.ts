import { AppTokenAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

// get twitch app client ID and secret
const {
	public: { twitchAppClientId },
	twitchAppClientSecret,
} = useRuntimeConfig();

// init twurple client
const twurpleAuthProvider = new AppTokenAuthProvider(
	twitchAppClientId,
	twitchAppClientSecret
);
const twurpleClient = new ApiClient({ authProvider: twurpleAuthProvider });

// provide twitch api (twurple) client to server routes
export default defineEventHandler((event) => {
	// attach the client to the event context
	event.context.twitchAPI = twurpleClient;
});
