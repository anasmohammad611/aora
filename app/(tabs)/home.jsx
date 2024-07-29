import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";

const Home = () => {
	return (
		<SafeAreaView>
			<FlatList
				data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<Text className="text-3xl text-white">{item.id}</Text>
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 space-y-6">
						<View className="justify-between tems-start flex-row mb-6">
							<View>
								<Text className="font-podium text-sm text-gray-100">
									Welcome back
								</Text>

								<Text className="text-2xl font-psemibold text-white">
									Anas
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
							<Trending
								posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []}
							/>
						</View>
					</View>
				)}
				ListEmptyComponent={() => <EmptyState 
					title = "No videos found" 
					subTitle = "No videos created"
					/>}
			/>
		</SafeAreaView>
	);
};

export default Home;