import { getExpense } from "@/core/expenses";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    Pressable,
    SectionList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// const DATA = [
//     {
//         title: "Today",
//         data: [
//             { id: "1", category: "Food", payer: "Member 1", amount: "$10" },
//             { id: "2", category: "Food", payer: "Member 1", amount: "$10" },
//         ],
//     },
//     {
//         title: "12 Jan, 2025",
//         data: [
//             { id: "3", category: "Food", payer: "Member 1", amount: "$10" },
//             { id: "4", category: "Food", payer: "Member 1", amount: "$10" },
//         ],
//     },
// ];
type Expense = {
    id: string;
    description: string;
    payer: string;
    amount: number;
};

type Section = {
    title: string;
    data: Expense[];
};

// function ExpenseItem({ item }: { item: (typeof DATA)[0]["data"][0] }) {
function ExpenseItem({ item }: { item: Expense }) {
    const router = useRouter();
    const handlePress = () => {
        router.push({
            pathname: "/expenses/update",
            params: { id: item.id }
        });
    };
    return (
        <Pressable className="flex-row bg-background-50 rounded-xl mb-4 items-stretch pr-4" onPress={handlePress}>
            <View className="w-16 bg-blue-600 rounded-l-xl items-center justify-center mr-3">
                <FontAwesome5
                    name="receipt"
                    color="#fff"
                    size={30}
                ></FontAwesome5>
            </View>
            <View className="flex-1 p-2 shadow-sm">
                <Text className="text-md font-semibold mb-1">
                    {/* {item.category} */}
                    {item.description}
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
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const expenses = await getExpense(db, parseInt(id as string));
                if (expenses && Array.isArray(expenses)) {
                    // Group expenses by date
                    const groupedExpenses = expenses.reduce((acc: { [key: string]: Expense[] }, expense) => {
                        const date = new Date(expense.created_at as string).toLocaleDateString();
                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        acc[date].push({
                            id: expense.id.toString(),
                            description: expense.description as string,
                            payer: expense.payer as string,
                            amount: expense.amount as number,
                        });
                        return acc;
                    }, {});

                    // Convert to sections format
                    const sectionsData = Object.entries(groupedExpenses).map(([date, expenses]) => ({
                        title: date,
                        data: expenses
                    }));

                    setSections(sectionsData);
                }
            } catch (error) {
                console.error("Failed to load expenses:", error);
            }
        };

        loadExpenses();
    }, [id]);

    return (
        <View className="flex-1">
            <SectionList
                // sections={DATA}
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
