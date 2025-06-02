import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, SafeAreaView, StatusBar } from "react-native";

export default function SplashScreen() {
    useEffect(() => {
        checkOnboarding();
    }, []);
    const checkOnboarding = async () => {
        try {
            const hasSeenOnboarding = await AsyncStorage.getItem(
                "hasSeenOnboarding"
            );
            setTimeout(async () => {
                if (hasSeenOnboarding === "true") {
                    router.replace("/(tabs)");
                } else {
                    router.replace("/onboard");
                }
            }, 4000);
        } catch (error) {
            console.error("Error checking onboarding status:", error);
            router.replace("/onboard");
        }
    };
    return (
        <LinearGradient
            colors={["#FFFFFF", "#1D63ED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 justify-center items-center"
        >
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <SafeAreaView className="flex-1 justify-center items-center">
                <Image
                    source={require("../assets/images/split-ease-logo.png")}
                    resizeMode="contain"
                />
            </SafeAreaView>
        </LinearGradient>
    );
}
