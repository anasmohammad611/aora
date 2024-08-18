import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	Alert,
} from "react-native";
import React, { useState } from "react";

import FormField from "../../components/CustomFormField";
import CustomButton from "../../components/CustomButton";

import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";

import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createVideo } from "../../lib/appwrite";

const Create = () => {
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState({
		title: "",
		video: null,
		thumbnail: null,
		prompt: "",
	});

	const openPicker = async (selectType) => {
		const res = await DocumentPicker.getDocumentAsync({
			type:
				selectType === "image"
					? ["image/png", "image/jpg", "image/jpeg"]
					: ["video/mp4", "video/gif"],
		});

		if (!res.canceled) {
			if (selectType === "image") {
				setForm({ ...form, thumbnail: res.assets[0] });
			}
			if (selectType === "video") {
				setForm({ ...form, video: res.assets[0] });
			}
		} else {
			setTimeout(() => {
				Alert.alert("Document picked", JSON.stringify(res, null, 2));
			}, 100);
		}
	};

	const submit = async () => {
		if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
			return Alert.alert("Please fill all the details");
		}

		setUploading(true);

		try {
			await createVideo({
				...form,
				userId: user.$id,
			});
			Alert.alert("success", "post uploaded");
			router.push("/home");
		} catch (error) {
			Alert.alert("Error", error.message);
		} finally {
			setForm({ title: "", video: null, thumbnail: null, prompt: "" });
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView className="px-4 my-6">
				<Text className="text-2xl text-white font-psemibold">
					Upload video
				</Text>

				<FormField
					title="Video Title"
					value={form.title}
					placeholder="Give your video a title..."
					handleChangeText={(e) => setForm({ ...form, title: e })}
					otherStyles="mt-10"
				></FormField>
				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-pmedium">
						Upload Video
					</Text>

					<TouchableOpacity onPress={() => openPicker("video")}>
						{form.video ? (
							<Video
								source={{ uri: form.video.uri }}
								className="w-full h-64 rounded-2xl"
								resizeMode={ResizeMode.COVER}
							/>
						) : (
							<View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
								<View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
									<Image
										source={icons.upload}
										className="w-1/2 h-1/2"
										resizeMode="contain"
									/>
								</View>
							</View>
						)}
					</TouchableOpacity>
				</View>
				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-pmedium">
						Thumbnail Image
					</Text>
					<TouchableOpacity onPress={() => openPicker("image")}>
						{form.thumbnail ? (
							<Image
								source={{ uri: form.thumbnail.uri }}
								className="w-full h-64 rounded-2xl"
								resizeMode="cover"
							/>
						) : (
							<View
								className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center
											border-2 border-black-200 flex-row space-x-2"
							>
								<Image
									source={icons.upload}
									className="w-5 h-5"
									resizeMode="contain"
								/>
								<Text className="text-sm text-gray-100 font-pmedium">
									Choose a file
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
				<FormField
					title="AI prompt"
					value={form.prompt}
					placeholder="The prompt you used to create this video"
					handleChangeText={(e) => setForm({ ...form, prompt: e })}
					otherStyles="mt-10"
				></FormField>
				<CustomButton
					title="submit & publish"
					handlePress={submit}
					containerStyles="mt-7"
					isLoading={uploading}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Create;
