import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";
import { Query } from "react-native-appwrite";

export const config = {
	endpoint: "https://cloud.appwrite.io/v1",
	platform: "com.sample.aora",
	projectId: "66a51ecf0010e0e53396",
	databaseId: "66a521c3001aaaa89db6",
	userCollectionId: "66a521ef0009e0696b4a",
	videosCollectionId: "66a5221b00088fda4f7a",
	storageId: "66a54828000d6fcd8a9d",
};

// Init your React Native SDK
const client = new Client();

client
	.setEndpoint(config.endpoint) // Your Appwrite Endpoint
	.setProject(config.projectId) // Your project ID
	.setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
	try {
		const currentSession = await account.getSession('current').catch(() => null);
		if (currentSession) {
			// Sign out if a session is active
			await account.deleteSession('current');
		}

		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);
		if (!newAccount) {
			throw error;
		}

		const avatarUrl = avatars.getInitials(username);
		await signIn(email, password);

		const newUser = await databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email,
				username,
				avatar: avatarUrl,
			}
		);
	} catch (error) {
		console.log("====================================");
		console.log('signup', error);
		console.log("====================================");
		throw new Error(error);
	}
};

export const signIn = async (email, password) => {
	try {
		const currentSession = await account.getSession('current').catch(() => null);
		if (currentSession) {
			console.log('Active session found:', currentSession);
			return currentSession;
		}
		const result = await account.createEmailPasswordSession(email, password);
		console.log(result);
		return result;
	} catch (error) {
		console.log("====================================");
		console.log('signIn', error);
		console.log("====================================");
		throw new Error(error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.log("====================================");
		console.log('getUser', error);
		console.log("====================================");
	}
};


export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId
		)

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId
			[Query.orderDesc('$createdAt', Query.limit(7))]
		)

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}