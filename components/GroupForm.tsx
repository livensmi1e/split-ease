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
import ParticipantList from "@/components/ParticipantsList";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Participant } from "@/types/group";

type GroupFormProps = {
  initialGroupName?: string;
  initialCurrency?: string;
  initialParticipants?: Participant[];
  onSubmit: (
    groupName: string,
    currency: string,
    participants: Participant[]
  ) => Promise<void>;
  title?: string;
  destination: string;
};

export default function GroupForm({
    initialGroupName = "",
    initialCurrency = "usd",
    initialParticipants = [],
    onSubmit,
    title = "Create new group",
    destination
    }: GroupFormProps) {
    const router = useRouter();
    const [currency, setCurrency] = useState(initialCurrency);
    const [groupName, setGroupName] = useState(initialGroupName);
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

    const handleDone = async () => {
        if (!groupName.trim()) {
            Alert.alert("Vui lòng nhập tên nhóm");
            return;
        }

        try {
            await onSubmit(groupName, currency, participants);
            if(destination == "/(tabs)/groups") router.push("/(tabs)/groups");
            else router.back();
        } catch (error) {
            console.error("Lỗi xử lý nhóm:", error);
            Alert.alert("Có lỗi xảy ra khi xử lý nhóm");
        }
        };

  return (
    <SafeAreaView className="flex-1 bg-white mt-5">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} />
          </TouchableOpacity>
          <Text className="text-xl font-bold">{title}</Text>
          <TouchableOpacity onPress={handleDone}>
            <Ionicons name="checkmark" size={28} />
          </TouchableOpacity>
        </View>

        {/* Group Name */}
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
            <Ionicons name="camera" size={24} color="#0F4CC2" />
          </View>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Group name"
            className="flex-1 border-b border-gray-300 text-md pb-1 text-typography-600"
          />
        </View>

        {/* Currency */}
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
            <Ionicons name="card" size={24} color="#0F4CC2" />
          </View>
          <View
            className="flex-1"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Text className="text-typography-600 text-sm mb-2">Currency</Text>
            <Select
              selectedValue={currency}
              onValueChange={(value: string) => {
                setCurrency(value);
              }}
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="USD" className="p-1 px-3" />
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
                  <SelectItem label="Default" value="usd" />
                  <SelectItem label="VND" value="vnd" />
                  <SelectItem label="USD" value="usd" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>
        </View>

        {/* Participants */}
        <Text className="text-md text-typography-800 mb-3">Participants</Text>
        <View>
          <ParticipantList
            onChange={setParticipants}
            initialData={initialParticipants}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
