import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from "../constants";

const CustomFormField = ({
	title,
	value,
	handleChangeText,
	placeholder,
	otherStyles,
	...props
}) => {
	const [showPass, setshowPass] = useState(false);
	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-base text-gray-100 font-pmedium">
				{title}
			</Text>
			<View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
				<TextInput
					className="flex-1 text-white font-psemibold text-base"
					value={value}
					placeholder={placeholder}
					onChangeText={handleChangeText}
					secureTextEntry={title === "Password" && !showPass}
				/>
				{title == "Password" && (
					<TouchableOpacity onPress={() => setshowPass(!showPass)}>
						<Image
							source={!showPass ? icons.eye : icons.eyeHide}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default CustomFormField;
