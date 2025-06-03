import { RecentExpenseProps } from "@/types/expense";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

function ExpenseItem({ expense }: { expense: RecentExpenseProps }) {
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
                <Text className="text-md font-semibold text-blue-500 mb-1">
                    ${expense.amount}
                </Text>
                <Text className="text-sm text-gray-500">{expense.date}</Text>
            </VStack>
        </HStack>
    );
}

export default function RecentExpensesList({
    expenses,
}: {
    expenses: RecentExpenseProps[];
}) {
    return (
        <View
            className="bg-background-50 border-border-200 border-[1px] rounded-lg p-4"
            style={{ maxHeight: 300 }}
        >
            <Text className="text-xl font-bold mb-4">My Recent Expenses</Text>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExpenseItem expense={item} />}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <Box className="h-2" />}
                contentContainerStyle={{ paddingBottom: 4, flexGrow: 0 }}
            ></FlatList>
        </View>
    );
}
