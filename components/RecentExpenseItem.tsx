import { RecentExpense } from "@/types/balance";
import React from "react";
import { Text } from "react-native";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

export default function ExpenseItem({ expense }: { expense: RecentExpense }) {
    return (
        <HStack className="justify-between">
            <VStack className="flex-1" space="xs">
                <Text className="text-md font-semibold mb-1 text-typography-800">
                    {expense.groupName}
                </Text>
                <Text className="text-xm font-medium">
                    Paid on {expense.name}
                </Text>
            </VStack>

            <VStack className="items-end">
                <Text className="text-sm font-semibold text-blue-500 mb-1">
                    ${expense.amount}
                </Text>
                <Text className="text-xs text-gray-500">{expense.date}</Text>
            </VStack>
        </HStack>
    );
}
