import { MemberBalanceProps } from "@/types/balance";
import React from "react";
import { Text, View } from "react-native";

const member: MemberBalanceProps = {
    id: "1",
    memberName: "Member 2",
    owes: 10,
    pays: 20,
};

export default function MemberBalanceCard({
    member,
}: {
    member: MemberBalanceProps;
}) {
    return (
        <View className="bg-background-900 rounded-xl p-4 w-full max-w-md items-center">
            <Text className="text-typography-300 text-xl font-semibold">
                {member.memberName}
            </Text>
            <View className="h-px bg-border-200 w-full my-2" />
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-typography-200 text-lg flex-1 text-center">
                    Pays ${member.pays}
                </Text>
                <View className="h-6 w-px bg-border-200 mx-2" />
                <Text className="text-typography-200 text-lg flex-1 text-center">
                    Owes ${member.pays}
                </Text>
            </View>
        </View>
    );
}
