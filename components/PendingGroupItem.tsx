import { PendingGroup } from "@/types/balance";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

export default function PendingGroupItem({ group }: { group: PendingGroup }) {
    const windowWidth = Dimensions.get("window").width - 32;
    return (
        <View
            className="p-4 border-border-200 bg-background-50 rounded-lg border-[1px]"
            style={{ width: windowWidth }}
        >
            <Text className="text-lg font-semibold mb-4">{group.name}</Text>
            <HStack className="justify-between">
                <VStack className="flex-1" space="lg">
                    <HStack className="items-center" space="sm">
                        <FontAwesome name="users" size={18} color="#666" />
                        <Text className="ml-2">
                            {group.memberCount} Members
                        </Text>
                    </HStack>
                    <HStack className="items-center" space="lg">
                        <FontAwesome6
                            name="money-check-dollar"
                            size={18}
                            color="#666"
                        />
                        <Text>{group.activityCount} Activities</Text>
                    </HStack>
                </VStack>
                <VStack className="items-end" space="md">
                    <Text className="text-primary-500 font-semibold">
                        My Expense: {group.myExpense}
                    </Text>
                    <Text className="text-primary-500 font-semibold">
                        Total: {group.totalExpense}
                    </Text>
                </VStack>
            </HStack>
        </View>
    );
}
