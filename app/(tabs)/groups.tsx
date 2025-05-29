import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import MemberBalanceCard from "@/components/MemberBalanceCard";
import MemberBalancesList from "@/components/MemberBalancesList";
import { MarkAsPaidProps, MemberBalanceProps } from "@/types/balance";
import { GroupItemProps } from "@/types/group";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Groups() {
    const balances: MarkAsPaidProps[] = [
        {
            id: "1",
            owner: "Member 1",
            target: "Member 2",
            amount: 10,
            isMe: false,
        },
        {
            id: "2",
            owner: "Member 1",
            target: "Member 2",
            amount: 10,
            isMe: true,
        },
    ];
    const groups: GroupItemProps[] = [
        {
            id: "1",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: true,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "2",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "3",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
        {
            id: "4",
            name: "Da Lat Trip",
            memberCount: 3,
            activityCount: 5,
            totalExpense: 100,
            myExpense: 20,
            isCompleted: false,
            avatar: require("@/assets/images/avatar.png"),
        },
    ];
    const members: MemberBalanceProps[] = [
        {
            id: "1",
            pays: 10,
            owes: 10,
            memberName: "Member 2",
        },
        {
            id: "2",
            pays: 10,
            owes: 10,
            memberName: "Member 2",
        },
        {
            id: "3",
            pays: 10,
            owes: 10,
            memberName: "Member 2",
        },
        {
            id: "4",
            pays: 10,
            owes: 10,
            memberName: "Member 2",
        },
        {
            id: "5",
            pays: 10,
            owes: 10,
            memberName: "Member 2",
        },
    ];
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <Text className="text-4xl font-bold mb-10">Your Groups</Text>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-4">
                    <MemberBalanceCard
                        member={{
                            id: "1",
                            memberName: "Member 2",
                            owes: 10,
                            pays: 20,
                        }}
                    ></MemberBalanceCard>
                </View>
                <View className="mb-4">
                    <MarkAsPaidsList balances={balances}></MarkAsPaidsList>
                </View>
                <View className="mb-4">
                    <MemberBalancesList members={members}></MemberBalancesList>
                </View>
                {/* <View className="flex-1">
                    <GroupsList groups={groups}></GroupsList>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    );
}
