import { deleteGroup } from "@/core/groups";
import { GroupItemProps } from "@/types/group";
import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

function GroupItem({
    group,
    onDelete,
}: {
    group: GroupItemProps;
    onDelete?: (id: number) => void;
}) {
    const db = useSQLiteContext();
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };
    const [needreRender, setNeedreRender] = useState(false);
    const handleEdit = () => {
        setMenuVisible(false);
        // TODO: Navigate or open edit modal
        router.push({
            pathname: "/groups/update",
            params: { id: group.id },
        });
    };
    const handleDelete = () => {
        setMenuVisible(false);
        // TODO: Confirm delete
        Alert.alert(
            "Xóa nhóm",
            "Bạn có thực sự muốn xóa nhóm này?",
            [
                {
                    text: "Huỷ",
                    onPress: () => console.log("Đã huỷ"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        deleteGroup(db, group.id);
                        onDelete?.(group.id);
                    },
                },
            ],
            { cancelable: true }
        );
        console.log("Remove group:", group.id);
    };
    const handleViewDetail = () => {
        router.push({
            pathname: "/groups/[id]",
            params: { id: group.id },
        });
    };
    return (
        <TouchableOpacity
            className="p-4 bg-background-50 border-border-200 border-[1px] rounded-xl mb-4"
            onPress={handleViewDetail}
        >
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
                        {/* <Pressable
                            style={({ pressed }) => [
                                {
                                    opacity: pressed ? 0.5 : 1,
                                },
                            ]}
                        >
                            <Text className="text-primary-500 font-semibold">
                                SEE MORE
                            </Text>
                        </Pressable> */}
                    </VStack>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function GroupsList({ groups }: { groups: GroupItemProps[] }) {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const tabBarHeight = useBottomTabBarHeight();
    const [groupList, setGroupList] = useState(groups);
    useEffect(() => {
        setGroupList(groups);
    }, [groups]);

    const handleGroupDeleted = (id: number) => {
        setGroupList((prev) => prev.filter((g) => g.id !== id));
    };

    const router = useRouter();
    const renderHeader = () => (
        <View
            className={`flex-row items-center mb-6 h-14 ${
                isSearching ? "gap-4" : "justify-between"
            }`}
        >
            {isSearching ? (
                <View className=" bg-background-50 rounded-xl flex-row items-center px-4 flex-1">
                    <Feather name="search" size={18} color="#666" />
                    <TextInput
                        className="text-md font-normal text-typography-600 ml-2 flex-1"
                        placeholder="Search"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSearchText("");
                            setIsSearching(false);
                        }}
                    >
                        <Feather name="x" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => setIsSearching(true)}>
                    <Feather name="search" size={24} color="#1D63ED" />
                </TouchableOpacity>
            )}
            <TouchableOpacity
                className="bg-primary-600 p-3 flex-row items-center gap-2 rounded-xl h-14"
                onPress={() => router.push("/groups/create")}
            >
                <Feather name="plus" color="#fff" size={20}></Feather>
                <Text className="text-white text-md">Add Group</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <View>
            <FlatList
                data={groupList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <GroupItem
                        onDelete={handleGroupDeleted}
                        group={item}
                    ></GroupItem>
                )}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
            ></FlatList>
        </View>
    );
}
