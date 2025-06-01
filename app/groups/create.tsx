import CurrencyDropdown from "@/components/Dropdown";
import Dropdown from "@/components/Dropdown";
import ParticipantList from "@/components/ParticipantsList";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { createGroup } from "@/core/groups";
import { addParticipant } from "@/core/participants";
import { Participant } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateGroup() {
    const router = useRouter();
    const [currency, setCurrency] = useState<string>('usd');
    const [groupName, setGroupName] = useState<string>("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const handleDone= async ()=>{
        try{
            const res =await createGroup(groupName, currency)
            // console.log("last id: ", res?.lastInsertRowId)
            if(res){
                for (const p of participants) {
                    await addParticipant(res.lastInsertRowId, p.name);
                }
            }
            router.push("/(tabs)/test")
        }    
        catch(error){
            console.error("Fail to create new group: ", error)
        }
    }
    return (
        <SafeAreaView className="flex-1 bg-white mt-5">
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Create new group</Text>
                    <TouchableOpacity onPress={handleDone}>
                        <Ionicons name="checkmark" size={28} />
                    </TouchableOpacity>
                </View>
                {/* Group Name Input */}
                <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
                        <Ionicons name="camera" size={24} color="#0F4CC2" />
                    </View>
                    <TextInput
                        onChangeText = {(e: string)=> setGroupName(e)}
                        placeholder="Group name"
                        className="flex-1 border-b border-gray-300 text-md pb-1 text-typography-600"
                    />
                </View>
                {/* Currency Input */}
                <View className="flex-row items-center gap-4 mb-6">
                    <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
                        <Ionicons name="card" size={24} color="#0F4CC2" />
                    </View>
                    <View className="flex-1" style={{ flexDirection: 'row', justifyContent: "space-between", gap: 8 }}>
                        <Text className="text-typography-600 text-sm mb-2">
                            Currency
                        </Text>
                        <View>
                            <Select
                                selectedValue={currency}
                                onValueChange={(value: string) => {
                                    setCurrency(value);
                                    console.log('Currency selected:', value);
                                }}
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

                <Text className="text-md text-typography-800 mb-3">
                    Participants
                </Text>
                {/* <View className="bg-background-50 rounded-lg p-4">
                    <TextInput className="text-md mb-3" placeholder="Your Name"></TextInput>
                    <TouchableOpacity onPress={() => {}}>
                        <Text className="text-primary-600">
                            Add Participant
                        </Text>
                    </TouchableOpacity>
                </View> */}
                <View>
                    <ParticipantList onChange={setParticipants}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
