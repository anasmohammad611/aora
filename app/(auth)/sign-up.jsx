import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import CustomFormField from "../../components/CustomFormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

import { createUser } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
	const { setUser, setIsLogged } = useGlobalContext();
	const [form, setform] = useState({
		username: "",
		email: "",
		password: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async () => {
		if (!form.username || !form.email || !form.password) {
			Alert.alert("Error", "Please fill in all the fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createUser(
				form.email,
				form.password,
				form.username
			);
			setUser(result);
			setIsLogged(true);

			router.replace("/home");
		} catch (error) {
			Alert.alert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View className="w-full justify-center min-h-[85vh] px-4 my-6">
					<Image
						source={images.logo}
						resizeMode="contain"
						className="w-[115px] h-[35px]"
					/>
					<Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
						Sign up to Aora
					</Text>
					<CustomFormField
						title="Username"
						value={form.username}
						handleChangeText={(e) =>
							setform({
								...form,
								username: e,
							})
						}
						otherStyles="mt-10"
					/>
					<CustomFormField
						title="Email"
						value={form.email}
						handleChangeText={(e) =>
							setform({
								...form,
								email: e,
							})
						}
						otherStyles="mt-7"
						keyBoardType="email-address"
					/>
					<CustomFormField
						title="Password"
						value={form.password}
						handleChangeText={(e) =>
							setform({
								...form,
								password: e,
							})
						}
						otherStyles="mt-7"
						keyBoardType="email-address"
					/>
					<CustomButton
						title="Sign Up"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>
					<View className="justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">
							Have an account already?
						</Text>
						<Link
							href="/sign-in"
							className="text-lg font-psemibold text-secondary "
						>
							Sign In
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
