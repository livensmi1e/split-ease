import { PendingGroupsListProps } from "@/types/balance";
import React from "react";
import { Dimensions, FlatList } from "react-native";
import PendingGroupItem from "./PendingGroupItem";
import { Box } from "./ui/box";

export default function PendingGroupsList({ groups }: PendingGroupsListProps) {
    const windowWidth = Dimensions.get("window").width;
    return (
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <PendingGroupItem group={item}></PendingGroupItem>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={windowWidth}
            ItemSeparatorComponent={() => <Box className="w-4" />}
        ></FlatList>
    );
}
