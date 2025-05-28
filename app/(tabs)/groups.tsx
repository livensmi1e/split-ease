import GroupsList from "@/components/GroupsList";
import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import { MarkAsPaidProps } from "@/types/balance";
import { GroupItemProps } from "@/types/group";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Groups() {
    const balances: MarkAsPaidProps[] = [
        {
            id: "1",
            owner: "Member 1",
            target: "Member 2",
            amount: 10,
            isMe: false,
        },
        {
            id: "2",
            owner: "Member 1",
            target: "Member 2",
            amount: 10,
            isMe: true,
        },
    ];
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
    ];
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <View className="mb-4">
                <MarkAsPaidsList balances={balances}></MarkAsPaidsList>
            </View>
            <View>
                <GroupsList groups={groups}></GroupsList>
            </View>
        </SafeAreaView>
    );
}
