import BalanceSummary from "@/components/BalanceSummary";
import RecentExpensesList from "@/components/RecentExpensesList";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const recentExpenses = [
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
    ];
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full">
            <BalanceSummary owesYou={10} youOwe={19}></BalanceSummary>
            <RecentExpensesList expenses={recentExpenses} />
        </SafeAreaView>
    );
}
