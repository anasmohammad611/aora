import {
	View,
	Text,
	FlatList,
	Image,
	RefreshControl,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useState } from "react";
import { getSavedPostsByUser } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
	const { data: posts, refetch } = useAppwrite(getSavedPostsByUser);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item} displayMenu={false} />
					// <Text />
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 space-y-6">
						<SearchInput />

						<View className="w-full flex-1 pt-5 pb-8">
							<Text className="text-gray-100 text-lg font-pregular mb-3">
								Saved Videos
							</Text>
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No videos found"
						subTitle="Save the videos from Home feed to see it here"
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

export default Bookmark;
