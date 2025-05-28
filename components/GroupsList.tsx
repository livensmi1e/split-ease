import { GroupItemProps } from "@/types/group";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

function GroupItem({ group }: { group: GroupItemProps }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };
    const handleEdit = () => {
        setMenuVisible(false);
        // TODO: Navigate or open edit modal
        console.log("Edit group:", group.id);
    };
    const handleDelete = () => {
        setMenuVisible(false);
        // TODO: Confirm delete
        console.log("Remove group:", group.id);
    };
    return (
        <TouchableOpacity className="p-4 bg-background-50 border-border-200 border-[1px] rounded-xl mb-4">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex justify-center items-center bg-primary-0 p-2 px-8 rounded-sm rounded-tl-xl">
                    <Text className="font-semibold text-primary-800">
                        {group.name}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleMenu}>
                    <FontAwesome
                        name="bars"
                        size={20}
                        color="#666"
                    ></FontAwesome>
                </TouchableOpacity>
                {menuVisible && (
                    <View className="absolute right-[-1] top-8 bg-white shadow-lg rounded-md  z-10">
                        <TouchableOpacity
                            onPress={handleEdit}
                            className="px-4 py-2"
                        >
                            <Text>Edit group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="px-4 py-2 bg-[#FEF1F1]"
                        >
                            <Text className="text-[#991B1B]">Remove group</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View className="flex-row items-center gap-6">
                <Image
                    source={group.avatar}
                    className="w-23 h-23 rounded-full"
                    alt="Group avatar"
                ></Image>
                <View>
                    <VStack className="flex-1" space="lg">
                        <HStack className="items-center" space="sm">
                            <FontAwesome name="users" size={18} color="#666" />
                            <Text className="ml-2">
                                <Text className="font-bold">Members:</Text>{" "}
                                {group.memberCount} Members
                            </Text>
                        </HStack>
                        <HStack className="items-center" space="lg">
                            <FontAwesome6
                                name="money-check-dollar"
                                size={18}
                                color="#666"
                            />
                            <Text>
                                <Text className="font-bold">Activities:</Text>{" "}
                                {group.activityCount} Activities
                            </Text>
                        </HStack>
                        <HStack className="items-center" space="lg">
                            <FontAwesome name="dollar" size={18} color="#666" />
                            <Text className="ml-1">
                                <Text className="font-bold">
                                    Total Expenses:
                                </Text>{" "}
                                {group.totalExpense}
                            </Text>
                        </HStack>
                        <HStack className="items-center" space="lg">
                            <FontAwesome
                                name="check-circle"
                                size={18}
                                color="#666"
                            />
                            <Text className="ml-1">
                                <Text className="font-bold">Status:</Text>{" "}
                                {group.isCompleted
                                    ? "Completed"
                                    : "Not Completed"}
                            </Text>
                        </HStack>
                    </VStack>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function GroupsList({ groups }: { groups: GroupItemProps[] }) {
    return (
        <View>
            {/* <GroupItem group={groups[0]}></GroupItem> */}
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <GroupItem group={item}></GroupItem>}
            ></FlatList>
        </View>
    );
}
