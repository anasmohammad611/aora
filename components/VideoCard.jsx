import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Button,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

import { useGlobalContext } from "../context/GlobalProvider";
import { saveVideoForUser } from "../lib/appwrite";

const VideoCard = ({
	video: {
		$id,
		title,
		thumbnail,
		video,
		users: { username, avatar },
	},
	displayMenu,
}) => {
	const { user, setUser, setIsLogged } = useGlobalContext();
	const [play, setPlay] = useState(false);

	const [visibleButton, setVisibleButton] = useState(false);

	const handleMenuPress = () => {
		setVisibleButton(!visibleButton);
	};

	const handleSave = async () => {
		await saveVideoForUser($id);
		setVisibleButton(false);
	};

	const handleOutsidePress = () => {
		if (visibleButton) {
			setVisibleButton(false);
		}
	};

	console.log('====================================');
	console.log(displayMenu);
	console.log('====================================');

	return (
		<TouchableWithoutFeedback onPress={handleOutsidePress}>
			<View className="flex-col items-center px-4 mb-14">
				<View className="flex-row gap-3 items-start">
					<View className="justify-center items-center flex-row flex-1">
						<View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
							<Image
								source={{ uri: avatar }}
								className="w-full h-full rounded-lg"
								resizeMode="cover"
							/>
						</View>
						<View className="justify-center flex-1 ml-3 gap-y-1">
							<Text
								className="text-white font-psemibold text-sm"
								numberOfLines={1}
							>
								{title}
							</Text>
							<Text
								className="text-xs text-gray-100 font-pregular"
								numberOfLines={1}
							>
								{username}
							</Text>
						</View>
					</View>
					<View className="relative pt-2 flex-row items-center">
						{displayMenu && (
							<TouchableOpacity onPress={handleMenuPress}>
								<Image
									source={icons.menu}
									className="w-5 h-5"
									resizeMode="contain"
								/>
							</TouchableOpacity>
						)}
						{visibleButton && (
							<View className="absolute right-0 flex-row items-center">
								<View className="bg-white p-2 rounded-lg shadow-lg mr-2">
									<TouchableOpacity
										onPress={handleSave}
										className="bg-secondary px-3 py-1 rounded-md"
									>
										<Text className="text-white font-psemibold text-sm">
											Save
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)}
					</View>
				</View>
				{play ? (
					<Video
						source={{ uri: video }}
						className="w-full h-60 rounded-xl mt-3"
						resizeMode={ResizeMode.CONTAIN}
						useNativeControls
						shouldPlay
						onPlaybackStatusUpdate={(status) => {
							if (status.didJustFinish) {
								setPlay(false);
							}
						}}
					/>
				) : (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => setPlay(true)}
						className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
					>
						<Image
							source={{ uri: thumbnail }}
							className="w-full h-full rounded-xl mt-3"
							resizeMode="cover"
						/>
						<Image
							source={icons.play}
							className="w-12 h-12 absolute"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

export default VideoCard;
