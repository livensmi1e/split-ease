import BalanceSummary from "@/components/BalanceSummary";
import PendingGroupsList from "@/components/PendingGroupsList";
import RecentExpensesList from "@/components/RecentExpensesList";
import { getMyPaymentInfo, getRecentExpensesFromMe } from "@/core/expenses";
import { getGroupsWithPendingDebt } from "@/core/groups";
import { RecentExpenseProps } from "@/types/expense";
import { GroupItemProps, RowData } from "@/types/group";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const [recentExpenses, setRecentExpenses] = useState<RecentExpenseProps[]>(
        []
    );
    const [myInfo, setMyInfo] = useState<any>({
        totalIOwe: 0,
        totalTheyOweMe: 0,
    });
    const [pendingGroups, setPendingGroups] = useState<any>([]);
    const db = useSQLiteContext();
    useEffect(() => {
        const load = async () => {
            const expenses = await getRecentExpensesFromMe(db);
            setRecentExpenses(expenses);
        };
        load();
    }, []);
    useEffect(() => {
        const calculate = async () => {
            const info = await getMyPaymentInfo(db);
            setMyInfo(info);
        };
        calculate();
    }, []);
    useEffect(() => {
        const load = async () => {
            const groups = await getGroupsWithPendingDebt(db);
            const formattedData: GroupItemProps[] = groups.map(
                (row: RowData) => {
                    return {
                        id: row.id as number,
                        name: row.name as string,
                        activityCount: row.activityCount as number,
                        memberCount: row.memberCount as number,
                        totalExpense: row.totalAmount
                            ? ((row.totalAmount / 2) as number)
                            : 0,
                        myExpense: 0,
                        isCompleted: false,
                        avatar: require("@/assets/images/avatar.png"),
                    };
                }
            );
            setPendingGroups(formattedData);
        };
        load();
    }, []);
    return (
        <SafeAreaView className="p-4 pt-0 bg-background-0 h-full flex-1">
            <Text className="text-5xl font-extrabold color-primary-500 mt-3 mb-5">
                SplitEase
            </Text>
            <View className="mb-4">
                <BalanceSummary
                    owesYou={myInfo.totalTheyOweMe}
                    youOwe={myInfo.totalIOwe}
                ></BalanceSummary>
            </View>
            <View className="mb-4">
                <RecentExpensesList expenses={recentExpenses} />
            </View>
            <View className="mb-4">
                <Text className="text-xl font-bold mb-4">Pending Groups</Text>
                {pendingGroups.length > 0 ? (
                    <PendingGroupsList groups={pendingGroups} />
                ) : (
                    <Text className="text-gray-500">No pending groups</Text>
                )}
            </View>
        </SafeAreaView>
    );
}
