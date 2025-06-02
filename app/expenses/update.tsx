import { getExpense, updateExpense } from "@/core/expenses";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function UpdateExpense() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const loadExpense = async () => {
            try {
                const expense = await getExpense(db, parseInt(id as string));
                if (expense && Array.isArray(expense) && expense.length > 0) {
                    setDescription(expense[0].description as string);
                    setAmount(expense[0].amount.toString());
                }
            } catch (error) {
                console.error("Failed to load expense:", error);
            }
        };

        loadExpense();
    }, [id]);

    const handleUpdateExpense = async () => {
        if (!description || !amount) return;
        
        try {
            const success = await updateExpense(
                db,
                parseInt(id as string),
                description,
                parseFloat(amount)
            );
            
            if (success) {
                router.back();
            }
        } catch (error) {
            console.error("Failed to update expense:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Edit expense</Text>
                    <TouchableOpacity onPress={handleUpdateExpense}>
                        <Ionicons name="checkmark" size={28} />
                    </TouchableOpacity>
                </View>
                {/* Description */}
                <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
                        <Ionicons
                            name="document-text-outline"
                            size={24}
                            color="#0F4CC2"
                        />
                    </View>
                    <TextInput
                        placeholder="The hotel"
                        value={description}
                        onChangeText={setDescription}
                        className="flex-1 border-b border-gray-300 text-md pb-1 text-typography-600"
                    />
                </View>
                {/* Currency */}
                <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
                        <Ionicons name="card" size={24} color="#0F4CC2" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-typography-600 text-sm mb-2">
                            Currency
                        </Text>
                        <View className="flex-row justify-between items-center border-b border-gray-300 pb-1">
                            <Text className="text-md">VND</Text>
                            <Ionicons name="chevron-down" size={20} />
                        </View>
                    </View>
                </View>
                {/* Amount */}
                <Text className="text-md text-typography-800 mb-3">Amount</Text>
                <TextInput
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-md px-4 py-3 text-md mb-6"
                />
                {/* Group Search */}
                <Text className="text-md text-typography-800 mb-3">
                    Select Group
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 mb-6">
                    <Ionicons name="search-outline" size={20} color="#888" />
                    <TextInput
                        placeholder="Search"
                        className="ml-2 flex-1 text-md"
                    />
                </View>
                {/* Recently */}
                <Text className="text-md text-typography-800 mb-3">
                    Recently
                </Text>
                <View className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-6">
                    <Image
                        source={{ uri: "https://placekitten.com/200/200" }}
                        className="w-8 h-8 rounded-full mr-3"
                    />
                    <Text className="text-md">Passion Dev</Text>
                </View>
                {/* All */}
                <Text className="text-md text-typography-800 mb-3">All</Text>
                {[1, 2, 3].map((_, idx) => (
                    <View
                        key={idx}
                        className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-3"
                    >
                        <Image
                            source={{ uri: "https://placekitten.com/200/200" }}
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <Text className="text-md">Passion Dev</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
