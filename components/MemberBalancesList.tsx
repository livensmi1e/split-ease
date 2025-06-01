import { MemberBalanceProps } from "@/types/balance";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

// const members: MemberBalanceProps[] = [
//     {
//         id: "1",
//         pays: 10,
//         owes: 10,
//         memberName: "Member 2",
//     },
//     {
//         id: "2",
//         pays: 10,
//         owes: 10,
//         memberName: "Member 2",
//     },
//     {
//         id: "3",
//         pays: 10,
//         owes: 10,
//         memberName: "Member 2",
//     },
//     {
//         id: "4",
//         pays: 10,
//         owes: 10,
//         memberName: "Member 2",
//     },
//     {
//         id: "5",
//         pays: 10,
//         owes: 10,
//         memberName: "Member 2",
//     },
// ];

function MemberBalanceItem({ member }: { member: MemberBalanceProps }) {
    return (
        <View className="flex-row justify-between items-center bg-background-50 rounded-xl p-4 mb-4">
            <View className="flex-row items-center gap-4">
                <FontAwesome5
                    name="user-circle"
                    color="#666"
                    size={32}
                    solid={true}
                ></FontAwesome5>
                <View>
                    <Text className="text-typography-900 font-semibold mb-1">
                        {member.memberName}
                    </Text>
                    <View className="flex-row gap-2">
                        <Text className="text-sm">Pays ${member.pays}</Text>
                        <Text>|</Text>
                        <Text className="text-sm">Owes ${member.owes}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity>
                <FontAwesome
                    name="angle-right"
                    color="#666"
                    size={32}
                ></FontAwesome>
            </TouchableOpacity>
        </View>
    );
}

export default function MemberBalancesList({
    members,
}: {
    members: MemberBalanceProps[];
}) {
    return (
        <View>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MemberBalanceItem member={item}></MemberBalanceItem>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            ></FlatList>
        </View>
    );
}
