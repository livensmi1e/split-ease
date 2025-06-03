import GroupsList from "@/components/GroupsList";
import { getAllGroup } from "@/core/groups";
import { GroupItemProps, RowData } from "@/types/group";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Groups() {
    const [groups, setGroups] = useState<GroupItemProps[]>([]);
    const db = useSQLiteContext();
    const loadData = async () => {
        try {
            const res = await getAllGroup(db);
            if (res) {
                const formattedData: GroupItemProps[] = res.map(
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
                setGroups(formattedData);
            }
        } catch (error) {
            console.error("Fail to load group: ", error);
        }
    };
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );
    useEffect(() => {
        loadData();
    }, []);

    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <Text className="text-4xl font-bold mb-10">Your Groups</Text>
            <View className="flex-1">
                <GroupsList groups={groups}></GroupsList>
            </View>
        </SafeAreaView>
    );
}
