import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, SectionList, Text, View } from "react-native";

const DATA = [
    {
        title: "Today",
        data: [
            { id: "1", category: "Food", payer: "Member 1", amount: "$10" },
            { id: "2", category: "Food", payer: "Member 1", amount: "$10" },
        ],
    },
    {
        title: "12 Jan, 2025",
        data: [
            { id: "3", category: "Food", payer: "Member 1", amount: "$10" },
            { id: "4", category: "Food", payer: "Member 1", amount: "$10" },
        ],
    },
];

const ExpenseItem = ({ item }: { item: (typeof DATA)[0]["data"][0] }) => (
    <Pressable className="flex-row items-center bg-background-50 rounded-xl mb-4">
        {/* Icon */}
        <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mr-3">
            <FontAwesome5 name="receipt" color="#fff" size="32"></FontAwesome5>
        </View>

        {/* Info */}
        <View className="flex-1 p-4 mx-4 shadow-sm">
            <Text className="text-base font-semibold">{item.category}</Text>
            <Text className="text-xs text-gray-500">
                Paid by <Text className="font-bold">{item.payer}</Text>
            </Text>
        </View>

        {/* Amount + Arrow */}
        <View className="flex-row items-center">
            <Text className="text-blue-600 text-base font-bold mr-2">
                {item.amount}
            </Text>
            <Text className="text-gray-400">{">"}</Text>
        </View>
    </Pressable>
);

export default function ExpensesList() {
    return (
        <View className="flex-1 bg-gray-50">
            <SectionList
                sections={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExpenseItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text className="text-base font-semibold px-4 pt-4 pb-2">
                        {title}
                    </Text>
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
