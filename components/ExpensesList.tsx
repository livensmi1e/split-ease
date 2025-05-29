import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
    Pressable,
    SectionList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

function ExpenseItem({ item }: { item: (typeof DATA)[0]["data"][0] }) {
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
    return (
        <View className="flex-1">
            <SectionList
                sections={DATA}
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
