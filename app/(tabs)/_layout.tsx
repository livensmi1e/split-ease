import TabbarButton from "@/components/TabbarButton";
import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: "#FFFFFF",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: "#E5E7EB",
                    elevation: 0,
                    shadowOpacity: 0,
                    position: "absolute",
                    overflow: "hidden",
                    bottom: insets.bottom,
                },
                tabBarActiveTintColor: "#1D63ED",
                tabBarInactiveTintColor: "#6B7280",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: "Groups",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="group" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create.placeholder"
                options={{
                    title: "",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="plus" size={28} color="#FFFFFF" />
                    ),
                    tabBarButton: (props) => <TabbarButton {...props} />,
                    tabBarLabel: () => null,
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/expenses/create");
                    },
                }}
            />
            <Tabs.Screen
                name="snap"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="camera" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="gear" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="test"
                options={{
                    title: "Test",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="gear" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
