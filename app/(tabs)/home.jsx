import {
	View,
	Text,
	FlatList,
	Image,
	RefreshControl,
	Alert,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { useState } from "react";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
	const { user, setUser, setIsLogged } = useGlobalContext();

	const { data: posts, refetch } = useAppwrite(getAllPosts);

	const { data: latestPosts } = useAppwrite(getLatestPosts);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};
	console.log("====================================");
	console.log(posts);
	console.log("====================================");
	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item} displayMenu = {true}/>
					// <Text />
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 space-y-6">
						<View className="justify-between tems-start flex-row mb-6">
							<View>
								<Text className="font-podium text-sm text-gray-100">
									Welcome back
								</Text>

								<Text className="text-2xl font-psemibold text-white">
									{user?.username}
								</Text>
							</View>
							<View className="mt-1.5">
								<Image
									source={images.logoSmall}
									className="w-9 h-10"
									resizeMode="contain"
								/>
							</View>
						</View>

						<SearchInput />

						<View className="w-full flex-1 pt-5 pb-8">
							<Text className="text-gray-100 text-lg font-pregular mb-3">
								Latest Videos
							</Text>
							<Trending posts={latestPosts ?? []} />
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No videos found"
						subTitle="Be the first one to upload a video"
					/>
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			/>
		</SafeAreaView>
	);
};

export default Home;
