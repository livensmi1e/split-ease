import { markAsPaid } from "@/core/expenses";
import { MarkAsPaidProps } from "@/types/balance";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "./ui/divider";

// const balances: MarkAsPaidProps[] = [
//     {
//         id: "1",
//         owner: "Member 1",
//         target: "Member 2",
//         amount: 10,
//         isMe: false,
//     },
//     {
//         id: "2",
//         owner: "Member 1",
//         target: "Member 2",
//         amount: 10,
//         isMe: true,
//     },
// ];

function MarkAsPaidItem({
    balance,
    onMarkAsPaid
}: {
    balance: MarkAsPaidProps;
    onMarkAsPaid: () => void;
}) {
    return (
        <View>
            <Text className="text-center text-sm font-medium text-typography-900 mb-4 mt-1">
                {balance.target} {balance.isMe ? "(me)" : ""}{" "}
                {"owes " + balance.owner + "   "}
                <Text className="text-primary-500 text-sm font-semibold">
                    ${balance.amount.toFixed(2)}
                </Text>
            </Text>

            <TouchableOpacity
                className="bg-primary-500 rounded-lg py-3 items-center mb-2"
                onPress={onMarkAsPaid}
            >
                <Text className="text-white font-semibold">Mark As Paid</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function MarkAsPaidsList({
    balances,
    onBalanceUpdate,
}: {
    balances: MarkAsPaidProps[];
    onBalanceUpdate?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const groupID = Array.isArray(id) ? id[0] : id;

    const handleMarkAsPaid = async (balance: MarkAsPaidProps) => {
        try {
            setIsLoading(true);
            const success = await markAsPaid(
                db,
                parseInt(groupID),
                balance.debtorId,
                balance.creditorId,
                balance.amount
            );

            if (success) {
                Alert.alert(
                    "Success",
                    "Payment has been marked as paid",
                    [{ text: "OK" }]
                );
                // Refresh balances
                onBalanceUpdate?.();
            } else {
                Alert.alert(
                    "Error",
                    "Failed to mark payment as paid",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error marking as paid:", error);
            Alert.alert(
                "Error",
                "An unexpected error occurred",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="bg-background-50 border-border-200 border-[1px] rounded-lg p-4">
            <FlatList
                keyExtractor={(item) => item.id}
                data={balances}
                renderItem={({ item }) => (
                    <MarkAsPaidItem
                        balance={item}
                        onMarkAsPaid={() => handleMarkAsPaid(item)}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <Divider className="my-4 bg-border-200" />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
