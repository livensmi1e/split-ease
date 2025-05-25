import { RecentExpensesListProps } from "@/types/balance";
import React from "react";
import { Text } from "react-native";
import ExpenseItem from "./RecentExpenseItem";
import { Box } from "./ui/box";
import { VStack } from "./ui/vstack";

export default function RecentExpensesList({
    expenses,
}: RecentExpensesListProps) {
    return (
        <VStack className="bg-background-50 border-border-200 border-[1px] rounded-lg p-4">
            <Text className="text-xl font-bold mb-4">My Recent Expenses</Text>
            <Box className="overflow-hidden">
                <VStack space="lg">
                    {expenses.map((expense) => (
                        <ExpenseItem key={expense.id} expense={expense} />
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
}
