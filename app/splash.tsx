import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, SafeAreaView } from "react-native";

export default function SplashScreen() {
    return (
        <LinearGradient
            colors={["#FFFFFF", "#1D63ED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 justify-center items-center"
        >
            <SafeAreaView className="flex-1 justify-center items-center">
                <Image
                    source={require("../assets/images/split-ease-logo.png")}
                    resizeMode="contain"
                />
            </SafeAreaView>
        </LinearGradient>
    );
}
