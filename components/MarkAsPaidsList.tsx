import { MarkAsPaidProps } from "@/types/balance";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "./ui/divider";

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

function MarkAsPaidItem({ balance }: { balance: MarkAsPaidProps }) {
    return (
        <View>
            <Text className="text-center text-sm font-medium text-typography-900 mb-4 mt-1">
                {balance.target} {balance.isMe ? "(me)" : ""}{" "}
                {"owes " + balance.owner + "   "}
                <Text className="text-primary-500 text-sm font-semibold">
                    {balance.amount}
                </Text>
            </Text>

            <TouchableOpacity className="bg-primary-500 rounded-lg py-3 items-center mb-2">
                <Text className="text-white font-semibold">Mark As Paid</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function MarkAsPaidsList({
    balances,
}: {
    balances: MarkAsPaidProps[];
}) {
    return (
        <View className="bg-background-50 border-border-200 border-[1px] rounded-lg p-4">
            <FlatList
                keyExtractor={(item) => item.id}
                data={balances}
                renderItem={({ item }) => (
                    <MarkAsPaidItem balance={item}></MarkAsPaidItem>
                )}
                ItemSeparatorComponent={() => (
                    <Divider className="my-4 bg-border-200" />
                )}
                showsVerticalScrollIndicator={false}
            ></FlatList>
        </View>
    );
}
