import BalanceSummary from "@/components/BalanceSummary";
import PendingGroupsList from "@/components/PendingGroupsList";
import RecentExpensesList from "@/components/RecentExpensesList";
import { RecentExpenseProps } from "@/types/expense";
import { GroupItemProps } from "@/types/group";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const recentExpenses: RecentExpenseProps[] = [
        {
            id: "1",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
        {
            id: "2",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
        {
            id: "3",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
        {
            id: "4",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
        {
            id: "5",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
        {
            id: "6",
            groupName: "Da Lat Trip",
            name: "Food",
            amount: 10,
            date: "Yesterday",
        },
    ];
    const pendingGroups: GroupItemProps[] = [
        {
            id: 1,
            name: "Da Lat Trip",
            activityCount: 5,
            memberCount: 3,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: 2,
            name: "Da Lat Trip",
            activityCount: 5,
            memberCount: 3,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: 3,
            name: "Da Lat Trip",
            activityCount: 5,
            memberCount: 3,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: true,
            avatar: require("@/assets/images/avatar.png"),
        },
    ].filter((item) => !item.isCompleted);
    return (
        <SafeAreaView className="p-4 pt-0 bg-background-0 h-full flex-1">
            <Text className="text-5xl font-extrabold color-primary-500 mt-3 mb-5">
                SplitEase
            </Text>
            <View className="mb-4">
                <BalanceSummary owesYou={10} youOwe={19}></BalanceSummary>
            </View>
            <View className="mb-4">
                <RecentExpensesList expenses={recentExpenses} />
            </View>
            <View className="mb-4">
                <Text className="text-xl font-bold mb-4">Pending Groups</Text>
                {pendingGroups.length > 0 ? (
                    <PendingGroupsList groups={pendingGroups} />
                ) : (
                    <Text className="text-gray-500">No pending groups</Text>
                )}
            </View>
        </SafeAreaView>
    );
}
