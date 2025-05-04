import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
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
        </Tabs>
    );
}
