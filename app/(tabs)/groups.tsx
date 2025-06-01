import GroupsList from "@/components/GroupsList";
import { getAllGroup } from "@/core/groups";
import { GroupItemProps, RowData } from "@/types/group";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";




export default function Groups() {
    const [groups, setGroups] = useState<GroupItemProps[]>([]);
    const loadData = async ()=>{
            try{
                const res = await getAllGroup();
                // console.log(res)
                if(res) {
                    const formattedData: GroupItemProps[] = res.map((row: RowData) => {
                    return {
                        id: row.id as number,
                        name: row.name as string,
                        activityCount: row.activityCount as number,
                        memberCount: row.memberCount as number,
                        totalExpense: row.totalAmount ? row.totalAmount as number: 0,
                        myExpense: 0,
                        isCompleted: false,
                        avatar: require("@/assets/images/avatar.png"),
                    };
                    });
                    // console.log(formattedData)
                    setGroups(formattedData)
            }
            }catch(error){
                console.error("Fail to load group: ",error)
            }
        }
    // const groups: GroupItemProps[] = [
    //     {
    //         id: "1",
    //         name: "Da Lat Trip",
    //         memberCount: 3,
    //         activityCount: 5,
    //         totalExpense: 100,
    //         myExpense: 20,
    //         isCompleted: true,
    //         avatar: require("@/assets/images/avatar.png"),
    //     },
    //     {
    //         id: "2",
    //         name: "Da Lat Trip",
    //         memberCount: 3,
    //         activityCount: 5,
    //         totalExpense: 100,
    //         myExpense: 20,
    //         isCompleted: false,
    //         avatar: require("@/assets/images/avatar.png"),
    //     },
    //     {
    //         id: "3",
    //         name: "Da Lat Trip",
    //         memberCount: 3,
    //         activityCount: 5,
    //         totalExpense: 100,
    //         myExpense: 20,
    //         isCompleted: false,
    //         avatar: require("@/assets/images/avatar.png"),
    //     },
    //     {
    //         id: "4",
    //         name: "Da Lat Trip",
    //         memberCount: 3,
    //         activityCount: 5,
    //         totalExpense: 100,
    //         myExpense: 20,
    //         isCompleted: false,
    //         avatar: require("@/assets/images/avatar.png"),
    //     },
    // ];
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );
    useEffect(()=>{
        loadData();
    },[])

    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <Text className="text-4xl font-bold mb-10">Your Groups</Text>
            <View className="flex-1">
                <GroupsList groups={groups}></GroupsList>
            </View>
        </SafeAreaView>
    );
}
