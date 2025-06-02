import { OnboardingItem } from "@/types/onboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from "react-native";
import ONBOARDING_DATA from "./data";

export default function OnboardScreen() {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width: SCREEN_WIDTH } = Dimensions.get("window");

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            setCurrentIndex(viewableItems[0]?.index || 0);
        }
    ).current;

    const handleNext = async () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            await AsyncStorage.setItem("hasSeenOnboarding", "true");
            router.replace("/(tabs)");
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        router.replace("/(tabs)");
    };

    const renderItem = ({ item }: { item: OnboardingItem }) => (
        <View className="px-6 items-center" style={{ width: SCREEN_WIDTH }}>
            <Image
                source={item.image}
                resizeMode="contain"
                className="h-96 w-full mb-5"
            ></Image>
            <View className="w-full px-4 pt-0">
                <Text className="text-2xl font-bold mb-[10px] text-center text-typography-900">
                    {item.heading}
                </Text>
                <Text className="text-sm text-center text-typography-700 font-medium">
                    {item.description}
                </Text>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={["#FFFFFF", "#C7D8FB"]} className="flex-1">
            <Pressable
                className="absolute top-12 right-5 z-10"
                onPress={handleSkip}
            >
                <Text className="text-sm text-primary-500 font-medium">
                    Skip
                </Text>
            </Pressable>

            <View className="flex-1 mt-[150px]">
                <FlatList
                    ref={flatListRef}
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50,
                    }}
                />
            </View>

            <View className="px-6 mb-[60px] w-full">
                <View className="flex-row justify-center gap-2 mb-[60px]">
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                                index === currentIndex
                                    ? " bg-blue-500"
                                    : " bg-gray-300"
                            }`}
                        />
                    ))}
                </View>
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-primary-500 rounded-full py-4 items-center"
                >
                    <Text className="text-white font-medium">
                        {currentIndex === ONBOARDING_DATA.length - 1
                            ? "Get Started"
                            : "Continue"}
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}
