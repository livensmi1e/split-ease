import { GroupItemProps } from "@/types/group";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";

function PendingGroupItem({ group }: { group: GroupItemProps }) {
    const windowWidth = Dimensions.get("window").width;
    return (
        <View
            className="p-4 border-border-200 bg-background-50 rounded-lg border-[1px]"
            style={{ width: windowWidth - 32 }} // hoặc windowWidth - 32 nhưng phải khớp với snapToInterval
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
                    <Text className="text-primary-500 font-semibold"></Text>
                    <Text className="text-primary-500 font-semibold">
                        Total: {group.totalExpense}
                    </Text>
                </VStack>
            </HStack>
        </View>
    );
}

export default function PendingGroupsList({
    groups,
}: {
    groups: GroupItemProps[];
}) {
    const windowWidth = Dimensions.get("window").width;
    return (
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PendingGroupItem group={item}></PendingGroupItem>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={windowWidth} // trùng với width item thực tế// hoặc windowWidth - 32 nếu item width = windowWidth - 32
            decelerationRate="fast"
            ItemSeparatorComponent={() => <Box className="w-4" />}
        />
    );
}
