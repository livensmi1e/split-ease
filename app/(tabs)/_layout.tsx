import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>
    );
}
