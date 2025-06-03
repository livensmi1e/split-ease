import { getExpensesByGroupId } from "@/core/expenses";
import { RowData } from "@/types/group";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    Pressable,
    SectionList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ExpenseItem = {
    id: string;
    category: string;
    payer: string;
    amount: string;
    date: string;
};

type ExpenseSection = {
    title: string;
    data: ExpenseItem[];
};

function ExpenseItem({ item }: { item: ExpenseItem }) {
    return (
        <Pressable className="flex-row bg-background-50 rounded-xl mb-4 items-stretch pr-4">
            <View className="w-16 bg-blue-600 rounded-l-xl items-center justify-center mr-3">
                <FontAwesome5
                    name="receipt"
                    color="#fff"
                    size={30}
                ></FontAwesome5>
            </View>
            <View className="flex-1 p-2 shadow-sm">
                <Text className="text-md font-semibold mb-1">
                    {item.category}
                </Text>
                <Text className="text-sm text-typography-900">
                    Paid by <Text className="font-bold">{item.payer}</Text>
                </Text>
            </View>
            <View className="flex-row items-center gap-2">
                <Text className="text-primary-500 text-lg font-bold mr-2">
                    {item.amount}
                </Text>
                <TouchableOpacity>
                    <FontAwesome
                        name="angle-right"
                        color="#666"
                        size={28}
                    ></FontAwesome>
                </TouchableOpacity>
            </View>
        </Pressable>
    );
}

export default function ExpensesList() {
    const [sections, setSections] = useState<ExpenseSection[]>([]);
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const groupID = Array.isArray(id) ? id[0] : id;

    const formatDate = (date: Date): string => {
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        if (isToday) {
            return "Today";
        }

        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const expenses = await getExpensesByGroupId(db, parseInt(groupID));

                // Group expenses by date
                const groupedExpenses = expenses.reduce((acc: { [key: string]: ExpenseItem[] }, expense: RowData) => {
                    const date = new Date(expense.created_at);
                    const dateStr = formatDate(date);

                    const expenseItem: ExpenseItem = {
                        id: expense.id.toString(),
                        category: expense.description,
                        payer: expense.paid_by_name,
                        amount: `$${expense.amount.toFixed(2)}`,
                        date: dateStr
                    };

                    if (!acc[dateStr]) {
                        acc[dateStr] = [];
                    }
                    acc[dateStr].push(expenseItem);
                    return acc;
                }, {});

                // Convert to sections format and sort by date (most recent first)
                const sectionsData = Object.entries(groupedExpenses)
                    .map(([date, items]) => ({
                        title: date,
                        data: items
                    }))
                    .sort((a, b) => {
                        if (a.title === "Today") return -1;
                        if (b.title === "Today") return 1;
                        return new Date(b.title).getTime() - new Date(a.title).getTime();
                    });

                setSections(sectionsData);
            } catch (error) {
                console.error("Failed to load expenses:", error);
            }
        };

        loadExpenses();
    }, [groupID]);

    return (
        <View className="flex-1">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExpenseItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text className="text-md font-medium pt-4 pb-4">
                        {title}
                    </Text>
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>
    );
}
