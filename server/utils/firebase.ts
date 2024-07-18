import admin from "firebase-admin";

// get config
const config = useRuntimeConfig();

// create firebase connection
export const app = admin.initializeApp({
	credential: admin.credential.cert({
		clientEmail: config.firebaseClientEmail,
		privateKey: config.firebasePrivateKey.replace(/\\n/g, "\n"),
		projectId: config.firebaseProjectId,
	}),
	databaseURL: useRuntimeConfig().firebaseDatabaseUrl,
});

// export realtime database
export const firebase = admin.database();
