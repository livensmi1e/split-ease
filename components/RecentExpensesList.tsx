import { RecentExpensesListProps } from "@/types/balance";
import React from "react";
import { FlatList, Text, View } from "react-native";
import ExpenseItem from "./RecentExpenseItem";
import { Box } from "./ui/box";

export default function RecentExpensesList({
    expenses,
}: RecentExpensesListProps) {
    return (
        <View
            className="bg-background-50 border-border-200 border-[1px] rounded-lg p-4"
            style={{ maxHeight: 310 }}
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
