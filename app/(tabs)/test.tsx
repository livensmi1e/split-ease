import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabView } from "react-native-tab-view";

const ExpensesRoute = () => (
    <View className="flex-1 bg-white p-4">
        <Text className="text-lg">Expenses content</Text>
    </View>
);

const BalancesRoute = () => (
    <View className="flex-1 bg-white p-4">
        <Text className="text-lg">Balances content</Text>
    </View>
);

const PhotosRoute = () => (
    <View className="flex-1 bg-white p-4">
        <Text className="text-lg">Photos content</Text>
    </View>
);

const routes = [
    { key: "expenses", title: "Expenses" },
    { key: "balances", title: "Balances" },
    { key: "photos", title: "Photos" },
];

export default function Test() {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const renderScene = SceneMap({
        expenses: ExpensesRoute,
        balances: BalancesRoute,
        photos: PhotosRoute,
    });
    const renderTabBar = () => (
        <View className="flex-row bg-gray-100 rounded-xl p-2 my-4 mx-2">
            {routes.map((route, i) => {
                const focused = i === index;
                return (
                    <Pressable
                        key={route.key}
                        className={`flex-1 py-3 rounded-xl items-center ${
                            focused ? "bg-blue-600" : ""
                        }`}
                        onPress={() => setIndex(i)}
                    >
                        <Text
                            className={`text-sm ${
                                focused ? "text-white font-bold" : "text-black"
                            }`}
                        >
                            {route.title}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    return (
        <SafeAreaView className="bg-white h-full flex-1">
            {renderTabBar()}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={() => null}
            />
        </SafeAreaView>
    );
}
