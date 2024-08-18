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
import { getAllPosts, getLatestPosts, searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
	const { query } = useLocalSearchParams();

	const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	useEffect(() => {
		refetch();
	}, [query]);

	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item} />
					// <Text />
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4">
						<Text className="font-podium text-sm text-gray-100">
							Search results
						</Text>

						<Text className="text-2xl font-psemibold text-white">
							{query}
						</Text>
						<View className="mt-6 mb-8">
							<SearchInput initialQuery={query} />
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No videos found"
						subTitle="No vids found for this search query"
					/>
				)}
			/>
		</SafeAreaView>
	);
};

export default Search;
