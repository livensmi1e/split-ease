import { ChevronDownIcon } from "@/components/ui/icon";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    return (
        <SafeAreaView className="p-4 bg-background-0 h-full flex-1">
            <Text className="text-4xl font-bold mb-10">Settings</Text>
            <TouchableOpacity
                className="rounded-md bg-background-50 border-border-100 border-[1px] p-4 mb-8"
                onPress={() => setIsDrawerOpen(true)}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-4">
                        <FontAwesome5 name="globe" size={18}></FontAwesome5>
                        <Text className="text-md">Language</Text>
                    </View>
                    <View className="flex-row items-center gap-4">
                        <Text className="text-md font-medium">
                            {selectedLanguage}
                        </Text>
                        <FontAwesome name="angle-down" size={24}></FontAwesome>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="rounded-md bg-background-50 border-border-100 border-[1px] p-4 mb-8">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-4">
                        <FontAwesome name="dollar" size={18}></FontAwesome>
                        <Text className="text-md ml-2">Currency</Text>
                    </View>
                    <View>
                        <Select
                            selectedValue={selectedCurrency}
                            onValueChange={(val) => setSelectedCurrency(val)}
                        >
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput
                                    placeholder="USD"
                                    className="p-1 px-3"
                                />
                                <SelectIcon
                                    as={ChevronDownIcon}
                                    className="text-background-950 w-6 h-6"
                                />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent className="pb-3">
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Default" value="usd">
                                        <View className="flex-row justify-between items-center"></View>
                                    </SelectItem>
                                    <SelectItem label="VND" value="vnd" />
                                    <SelectItem label="USD" value="usd" />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className="rounded-md bg-background-50 border-border-100 border-[1px] p-2 mb-8"
                onPress={() => setIsDrawerOpen(true)}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-4">
                        <FontAwesome5 name="adjust" size={18}></FontAwesome5>
                        <Text className="text-md">Dark Mode</Text>
                    </View>

                    <Switch
                        className="text-primary-50"
                        defaultValue={true}
                        trackColor={{
                            false: "#DDDCDB",
                            true: "#1D63ED",
                        }}
                        thumbColor="#fff"
                    ></Switch>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                className="rounded-md bg-background-50 border-border-100 border-[1px] p-4 mb-8"
                onPress={() => setIsDrawerOpen(true)}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-4">
                        <FontAwesome name="vcard-o" size={18}></FontAwesome>
                        <Text className="text-md">About us</Text>
                    </View>
                    <FontAwesome name="angle-down" size={24}></FontAwesome>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
