import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from "../constants";

const SearchInput = ({
	title,
	value,
	handleChangeText,
	placeholder,
	otherStyles,
	...props
}) => {
	const [showPass, setshowPass] = useState(false);
	return (
		<View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
			<TextInput
				className="text-base mt-0.5 text-white flex-1 font-pregular"
				value={value}
				placeholder="Search for a video topic"
				onChangeText={handleChangeText}
				secureTextEntry={title === "Password" && !showPass}
			/>
			<TouchableOpacity>
				<Image
					source={icons.search}
					className="w-5 h-5"
					resizeMode="contain"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default SearchInput;
