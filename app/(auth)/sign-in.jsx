import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import CustomFormField from "../../components/CustomFormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

import { getCurrentUser, signIn } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
	const { setUser, setIsLogged } = useGlobalContext();
	const [form, setform] = useState({
		email: "",
		password: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async () => {
		if (!form.email || !form.password) {
			Alert.alert("Error", "Please fill in all the fields");
			return;
		}
		setIsSubmitting(true);

		try {
			await signIn(form.email, form.password);
			const result = await getCurrentUser();
			if (result) {
				setUser(result);
				setIsLogged(true);
				router.replace("/home");
			} else {
				throw new Error("Failed to get user information");
			}

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
						Sign in to Aora
					</Text>
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
						title="Sign In"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>
					<View className="justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">
							Don't have an account?
						</Text>
						<Link
							href="/sign-up"
							className="text-lg font-psemibold text-secondary "
						>
							Sign Up
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
