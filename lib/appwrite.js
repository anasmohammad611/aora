import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Storage,
} from "react-native-appwrite";
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
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
	try {
		const currentSession = await account
			.getSession("current")
			.catch(() => null);
		if (currentSession) {
			// Sign out if a session is active
			await account.deleteSession("current");
		}

		const newAccount = await account.create(
			databases.unique(),
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
		console.log("signup", error);
		console.log("====================================");
		throw new Error(error);
	}
};

export const signIn = async (email, password) => {
	try {
		const currentSession = await account
			.getSession("current")
			.catch(() => null);
		if (currentSession) {
			console.log("Active session found:", currentSession);
			return currentSession;
		}
		const result = await account.createEmailPasswordSession(
			email,
			password
		);
		console.log(result);
		return result;
	} catch (error) {
		console.log("====================================");
		console.log("signIn", error);
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
		console.log("getUser", error);
		console.log("====================================");
	}
};

export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

export const searchPosts = async (query) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.search("title", query)]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

export const getUsersPosts = async (userId) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.equal("users", userId)]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};

export const signOut = async () => {
	try {
		const session = await account.deleteSession("current");
		return session;
	} catch (error) {
		throw new Error(error);
	}
};

export const getFilePreview = async (fileId, type) => {
	let fileUrl;

	try {
		if (type === "video") {
			fileUrl = storage.getFileView(config.storageId, fileId);
		} else if (type == "image") {
			fileUrl = storage.getFilePreview(
				config.storageId,
				fileId,
				2000,
				2000,
				"top",
				100
			);
		} else {
			throw new Error("Invalid file type");
		}

		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
};

export const uploadFile = async (file, type) => {
	if (!file) return;

	const { mimeType, ...rest } = file;
	const asset = { type: mimeType, ...rest };

	try {
		const uploadedFile = await storage.createFile(
			config.storageId,
			ID.unique(),
			asset
		);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
};

export const createVideo = async (form) => {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, "image"),
			uploadFile(form.video, "video"),
		]);

		const newPost = await databases.createDocument(
			config.databaseId,
			config.videosCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				users: form.userId,
			}
		);

		return newPost;
	} catch (error) {
		throw new Error(error);
	}
};

export const saveVideoForUser = async (videoId) => {
	try {
		console.log("====================================");
		console.log(videoId);
		console.log("====================================");
		const currentAccount = await account.get();
		if (!currentAccount) throw Error;

		const currentUserResponse = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUserResponse || currentUserResponse.documents.length === 0)
			throw Error;

		const currentUser = currentUserResponse.documents[0];
		const updatedSavedVideos = [...currentUser.savedVideos, videoId];

		await databases.updateDocument(
			config.databaseId,
			config.userCollectionId,
			currentUser.$id,
			{
				savedVideos: updatedSavedVideos,
			}
		);

		return updatedSavedVideos;
	} catch (error) {
		console.log("====================================");
		console.log("getUser", error);
		console.log("====================================");
	}
};

export const getSavedPostsByUser = async () => {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) throw Error("User not logged in");

		
		const currentUserResponse = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (
			!currentUserResponse ||
			currentUserResponse.documents.length === 0
		) {
			throw Error("User not found");
		}

		const currentUser = currentUserResponse.documents[0];
		const savedVideoIds = currentUser.savedVideos || [];

		
		if (savedVideoIds.length === 0) {
			return [];
		}

		
		const savedPosts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.equal("$id", savedVideoIds)]
		);

		return savedPosts.documents;
	} catch (error) {
		console.error("getSavedPostsByUser", error);
		throw new Error("Failed to fetch saved posts");
	}
};
