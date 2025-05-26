import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import { MarkAsPaid } from "@/types/balance";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Groups() {
    const balances: MarkAsPaid[] = [
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
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <View>
                <MarkAsPaidsList balances={balances}></MarkAsPaidsList>
            </View>
        </SafeAreaView>
    );
}
