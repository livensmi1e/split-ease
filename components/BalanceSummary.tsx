import { BalanceSummaryProps } from "@/types/balance";
import React from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";

export default function BalanceSummary({
    youOwe,
    owesYou,
}: BalanceSummaryProps) {
    return (
        <HStack className="justify-between mb-4 gap-4">
            <Box className="flex-1 rounded-xl bg-background-900 p-4 ">
                <Text className="text-typography-50 font-bold text-2xl mb-2">
                    {youOwe}
                </Text>
                <Text className="text-typography-50 font-medium text-xl">
                    You Owe
                </Text>
            </Box>
            <Box className="flex-1 rounded-xl bg-background-50 p-4 border-border-200 border-[1px]">
                <Text className="text-typography-900 font-bold text-2xl mb-2">
                    {owesYou}
                </Text>
                <Text className="text-typography-900 font-medium text-xl">
                    Owes You
                </Text>
            </Box>
        </HStack>
    );
}
