import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function UpdateGroup() {
    const router = useRouter();
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
                    <Text className="text-xl font-bold">Edit group</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="checkmark" size={28} />
                    </TouchableOpacity>
                </View>
                {/* Group Name Input */}
                <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
                        <Ionicons name="camera" size={24} color="#0F4CC2" />
                    </View>
                    <TextInput
                        placeholder="Group name"
                        className="flex-1 border-b border-gray-300 text-md pb-1 text-typography-600"
                    />
                </View>
                {/* Currency Input */}
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
                {/* Participants Section */}
                <Text className="text-md text-typography-800 mb-3">
                    Participants
                </Text>
                <View className="bg-background-50 rounded-lg p-4">
                    <Text className="text-md mb-3">Your Name</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text className="text-primary-600">
                            Add Participant
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
