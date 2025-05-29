import GroupsList from "@/components/GroupsList";
import { GroupItemProps } from "@/types/group";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Groups() {
    const groups: GroupItemProps[] = [
        {
            id: "1",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: true,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "2",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "3",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "4",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
    ];
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <Text className="text-4xl font-bold mb-10">Your Groups</Text>
            <View className="flex-1">
                <GroupsList groups={groups}></GroupsList>
            </View>
        </SafeAreaView>
    );
}
