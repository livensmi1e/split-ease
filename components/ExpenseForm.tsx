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
import { getAllGroup, getGroup } from "@/core/groups";
import { getParticipantsByGroupID } from "@/core/participants";
import { Participant } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView, // Add KeyboardAvoidingView
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Group = {
  id: number;
  name: string;
};

type ExpenseFormProps = {
  initialDescription?: string;
  initialAmount?: string;
  initialGroupId?: string;
  initialCurrency?: string;
  initialParticipants?: Participant[];
  initialPaidBy?: Participant | null;
  initialSplitMethod?: "equally" | "as parts" | "as amounts";
  initialParticipantParts?: { [id: number]: number };
  initialParticipantAmounts?: { [id: number]: number };
  expenseId?: string;
  onSubmit: (
    description: string,
    amount: string,
    currency: string,
    groupId?: string,
    participants?: Participant[],
    paidBy?: Participant | null,
    splitMethod?: "equally" | "as parts" | "as amounts",
    participantParts?: { [id: number]: number },
    participantAmounts?: { [id: number]: number }
  ) => Promise<void>;
  title?: string;
  destination?: string;
};

export default function ExpenseForm({
  initialDescription = "",
  initialAmount = "",
  initialGroupId = "",
  initialCurrency = "usd",
  initialParticipants = [],
  initialPaidBy = null,
  initialSplitMethod = "equally",
  initialParticipantParts = {},
  initialParticipantAmounts = {},
  expenseId,
  onSubmit,
  title = "Create new expense",
  destination = "",
}: ExpenseFormProps) {
  const router = useRouter();
  const db = useSQLiteContext();
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount);
  const [groupId, setGroupId] = useState(initialGroupId);
  const [groupName, setGroupName] = useState("");
  const [currency, setCurrency] = useState(initialCurrency);
  const [members, setMembers] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>(initialParticipants);
  const [paidBy, setPaidBy] = useState<Participant | null>(initialPaidBy);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(!initialGroupId);
  const [splitMethod, setSplitMethod] = useState<"equally" | "as parts" | "as amounts">(initialSplitMethod);
  const [participantParts, setParticipantParts] = useState<{ [id: number]: number }>(initialParticipantParts);
  const [participantAmounts, setParticipantAmounts] = useState<{ [id: number]: number }>(initialParticipantAmounts);
  const [enteredAmountParticipants, setEnteredAmountParticipants] = useState<number[]>(initialParticipantAmounts ? Object.keys(initialParticipantAmounts).map(Number) : []);
  const [shakeAnimation] = useState<{ [id: number]: Animated.Value }>({}); // Initialize shakeAnimation once

  const shakeInput = (participantId: number) => {
    if (!shakeAnimation[participantId]) {
      shakeAnimation[participantId] = new Animated.Value(0);
    }
    Animated.sequence([
      Animated.timing(shakeAnimation[participantId], { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation[participantId], { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation[participantId], { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation[participantId], { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    const loadGroupData = async () => {
      if (groupId) {
        try {
          const group = await getGroup(db, groupId);
          if (group && group.length > 0) {
            setGroupName(group[0].name);
            setIsSearchVisible(false);
          }
          const groupMembers = await getParticipantsByGroupID(db, groupId);
          if (groupMembers) {
            const mappedMembers = groupMembers.map((item) => ({
              name: item.name as string,
              id: item.id as number,
            }));
            setMembers(mappedMembers);
            // If paidBy is no longer a member of the new group, reset it
            if (paidBy && !mappedMembers.some((m) => m.id === paidBy.id)) {
              setPaidBy(null);
            }
            // Filter selectedParticipants to only include members of the current group
            setSelectedParticipants((prev) =>
              prev.filter((p) => mappedMembers.some((m) => m.id === p.id))
            );

            // Reset split values when group changes, unless it's initial load with existing data
            if (!initialGroupId || initialGroupId !== groupId) {
              setParticipantParts({});
              setParticipantAmounts({});
              setEnteredAmountParticipants([]);
            }
          }
        } catch (error) {
          console.error("Failed to load group data:", error);
          alert("An error occurred while loading group data");
        }
      } else {
        setGroupName("");
        setMembers([]);
        setPaidBy(null);
        setSelectedParticipants([]);
        setSplitMethod("equally");
        setParticipantParts({});
        setParticipantAmounts({});
        setEnteredAmountParticipants([]);
        setIsSearchVisible(true);
      }
    };
    loadGroupData();
  }, [groupId, db, initialGroupId]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const allGroups = await getAllGroup(db);
        if (allGroups) {
          setGroups(
            allGroups.map((gr) => {
              const { id, name } = gr;
              return { id, name };
            })
          );
        }
      } catch (error) {
        console.error("Failed to load groups:", error);
        alert("An error occurred while loading group list");
      }
    };
    loadGroups();
  }, [db]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectGroup = (group: Group) => {
    setGroupId(group.id.toString());
    setGroupName(group.name);
    setSearchQuery("");
    setIsSearchVisible(false);
  };

  const clearGroup = () => {
    setGroupId("");
    setGroupName("");
    setMembers([]);
    setSelectedParticipants([]);
    setPaidBy(null);
    setSplitMethod("equally");
    setParticipantParts({});
    setParticipantAmounts({});
    setEnteredAmountParticipants([]);
    setIsSearchVisible(true);
  };

  const toggleParticipant = (participant: Participant) => {
    setSelectedParticipants((prev) => {
      const isSelected = prev.some((p) => p.id === participant.id);
      const newParticipants = isSelected
        ? prev.filter((p) => p.id !== participant.id)
        : [...prev, participant];

      setParticipantParts((prevParts) => {
        const newParts = { ...prevParts };
        if (isSelected) { // If deselecting
          delete newParts[participant.id];
        } else if (!(participant.id in newParts)) { // If selecting and no default part
          newParts[participant.id] = 1; // Default to 1 part
        }
        return newParts;
      });

      setParticipantAmounts((prevAmounts) => {
        const newAmounts = { ...prevAmounts };
        if (isSelected) { // If deselecting
          delete newAmounts[participant.id];
        } else if (!(participant.id in newAmounts)) { // If selecting and no default amount
          newAmounts[participant.id] = 0; // Default to 0 amount
        }
        return newAmounts;
      });

      setEnteredAmountParticipants((prev) =>
        prev.filter((id) => newParticipants.some((p) => p.id === id))
      );
      return newParticipants;
    });
  };


  const handlePaidByChange = (value: string) => {
    const selectedMember = members.find((member) => member.id.toString() === value) || null;
    setPaidBy(selectedMember);
    // Removed the automatic addition of paidBy to selectedParticipants
    // if (selectedMember && !selectedParticipants.some((p) => p.id === selectedMember.id)) {
    //   setSelectedParticipants((prev) => [...prev, selectedMember]);
    // }
  };

  const calculateParticipantAmount = (participantId: number): number => {
    if (!selectedParticipants.length || !amount) return 0;
    const totalAmount = parseFloat(amount) || 0;

    if (splitMethod === "equally") {
      return totalAmount / selectedParticipants.length;
    } else if (splitMethod === "as parts") {
      const totalParts = selectedParticipants.reduce((sum, p) => sum + (participantParts[p.id] || 1), 0);
      const parts = participantParts[participantId] || 1;
      return totalParts > 0 ? (totalAmount * parts) / totalParts : 0;
    } else if (splitMethod === "as amounts") {
      if (!selectedParticipants.some((p) => p.id === participantId)) return 0;

      // If this participant has an entered amount, use it
      if (enteredAmountParticipants.includes(participantId)) {
        return participantAmounts[participantId] || 0;
      }

      // Calculate total entered amounts for all participants with manual input
      const enteredTotal = selectedParticipants.reduce(
        (sum, p) => sum + (enteredAmountParticipants.includes(p.id) ? participantAmounts[p.id] || 0 : 0),
        0
      );

      // Calculate remaining amount for auto-assigned participants
      const autoAssignedParticipants = selectedParticipants.filter(
        (p) => !enteredAmountParticipants.includes(p.id)
      );
      const remainingAmount = totalAmount - enteredTotal;
      const amountPerAuto = autoAssignedParticipants.length > 0 ? remainingAmount / autoAssignedParticipants.length : 0;

      return amountPerAuto < 0 ? 0 : amountPerAuto;
    }
    return 0;
  };

  const handleDone = async () => {
    if (!description || !amount) {
      alert("Please enter description and amount.");
      return;
    }
    if (!groupId) {
      alert("Please select a group.");
      return;
    }
    if (!selectedParticipants.length) {
      alert("Please select at least one participant.");
      return;
    }
    if (!paidBy) {
      alert("Please select a payer.");
      return;
    }
    if (!splitMethod) {
      alert("Please select a split method.");
      return;
    }
    if (splitMethod === "as amounts") {
      const totalAmounts = selectedParticipants.reduce(
        (sum, p) => sum + calculateParticipantAmount(p.id),
        0
      );
      const inputAmount = parseFloat(amount) || 0;
      // Compare with a small tolerance to avoid floating-point issues
      if (Math.abs(totalAmounts - inputAmount) > 0.01) {
        alert("Total split amounts must equal the total expense amount!");
        return;
      }
    }

    try {
      await onSubmit(description, amount, currency, groupId, selectedParticipants, paidBy, splitMethod, participantParts, participantAmounts);
      if (destination === "/(tabs)/group") router.push("/");
      else router.back();
    } catch (error) {
      console.error("Error processing expense:", error);
      alert("An error occurred while processing the expense.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Wrap your ScrollView with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }} // Ensure it takes full height
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' for iOS, 'height' for Android
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset if you have a fixed header/navbar
      >
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Keep keyboard open when tapping other UI elements
        >
          <View className="flex-row items-center justify-between mt-5 mb-10">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
            <Text className="text-xl font-bold">{title}</Text>
            <TouchableOpacity onPress={handleDone}>
              <Ionicons name="checkmark" size={28} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
              <Ionicons name="document-text-outline" size={24} color="#0F4CC2" />
            </View>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              className="flex-1 border-b border-gray-300 text-md pb-1 text-typography-600"
            />
          </View>

          {/* Currency */}
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
              <Ionicons name="card" size={24} color="#0F4CC2" />
            </View>
            <View className="flex-1" style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
              <Text className="text-typography-600 text-sm mb-2">Currency</Text>
              <Select selectedValue={currency} onValueChange={(value: string) => setCurrency(value)}>
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="USD" className="p-1 px-3" />
                  <SelectIcon as={ChevronDownIcon} className="text-background-950 w-6 h-6" />
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

          {/* Amount */}
          <Text className="text-md text-typography-800 mb-3">Amount</Text>
          <TextInput
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="border border-gray-300 rounded-md px-4 py-3 text-md mb-2"
          />
          <Text className="text-md text-typography-600 mb-4">
            Total Amount: {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
          </Text>

          {/* Group Selection */}
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
              <Ionicons name="people" size={24} color="#0F4CC2" />
            </View>
            <View className="flex-1">
              <Text className="text-typography-600 text-sm mb-2">Select group</Text>
              {isSearchVisible ? (
                <>
                  <View className="flex-row items-center border border-gray-300 rounded-md px-3 mb-3">
                    <Ionicons name="search-outline" size={20} color="#888" />
                    <TextInput
                      placeholder="Search group"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      className="ml-2 flex-1 text-md"
                    />
                  </View>
                  {searchQuery && filteredGroups.length > 0 && (
                    <View className="bg-gray-100 rounded-lg max-h-40 overflow-hidden">
                      {filteredGroups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          onPress={() => selectGroup(group)}
                          className="p-3 border-b border-gray-200"
                        >
                          <Text className="text-md">{group.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  {searchQuery && filteredGroups.length === 0 && (
                    <Text className="text-md text-typography-600">No group found</Text>
                  )}
                </>
              ) : (
                <View className="flex-row items-center justify-between border-b border-gray-300 pb-1">
                  <Text className="text-md">{groupName}</Text>
                  <TouchableOpacity onPress={clearGroup}>
                    <Ionicons name="close" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Paid By */}
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
              <Ionicons name="wallet" size={24} color="#0F4CC2" />
            </View>
            <View className="flex-1" style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
              <Text className="text-typography-600 text-sm mb-2">Paid by</Text>
              <Select selectedValue={paidBy ? paidBy.id.toString() : ""} onValueChange={handlePaidByChange}>
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="Select payer" value={paidBy ? paidBy.name : ""} className="p-1 px-3" />
                  <SelectIcon as={ChevronDownIcon} className="text-background-950 w-6 h-6" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent className="pb-3">
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {members.map((member) => (
                      <SelectItem key={member.id} label={member.name} value={member.id.toString()} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
          </View>

          {/* Split Method */}
          <View className="flex-row items-center gap-4 mb-6">
            <View
              className="flex-1"
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <Text className="text-typography-600 text-sm mb-2">Split</Text>
              <Select
                selectedValue={splitMethod}
                onValueChange={(value: string) => setSplitMethod(value as "equally" | "as parts" | "as amounts")}
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput
                    placeholder="Select method"
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
                    <SelectItem label="Equally" value="equally" />
                    <SelectItem label="As parts" value="as parts" />
                    <SelectItem label="As amounts" value="as amounts" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
          </View>

          {/* Participants */}
          <Text className="text-md text-typography-800 mb-3">Select Contributors</Text>
          {members.length > 0 ? (
            members.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => toggleParticipant(member)}
                className="flex-row items-center bg-gray-100 p-3 rounded-lg mb-3"
              >
                <Ionicons
                  name={
                    selectedParticipants.some((p) => p.id === member.id)
                      ? "checkbox-outline"
                      : "square-outline"
                  }
                  size={20}
                  color="#0F4CC2"
                  style={{ marginRight: 12 }}
                />
                <Image
                  source={{ uri: "https://placekitten.com/200/200" }} // Placeholder image
                  className="w-8 h-8 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="text-md">{member.name}</Text>
                  {selectedParticipants.some((p) => p.id === member.id) && (
                    <View className="mt-1">
                      <Text className="text-sm text-typography-600">
                        Amount: ${calculateParticipantAmount(member.id).toFixed(2)}
                      </Text>
                      {splitMethod === "as parts" && (
                        <TextInput
                          placeholder="Parts"
                          value={participantParts[member.id]?.toString() || "1"}
                          onChangeText={(text) => {
                            setParticipantParts((prev) => ({
                              ...prev,
                              [member.id]: parseInt(text) || 1,
                            }));
                          }}
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                        />
                      )}
                      {splitMethod === "as amounts" && (
                        <Animated.View
                          style={{
                            transform: [
                              { translateX: shakeAnimation[member.id] || new Animated.Value(0) },
                            ],
                          }}
                        >
                          <TextInput
                            placeholder="Amount"
                            value={
                              enteredAmountParticipants.includes(member.id)
                                ? participantAmounts[member.id]?.toString() || ""
                                : calculateParticipantAmount(member.id).toFixed(2) // Display calculated for auto-assigned
                            }
                            onChangeText={(text) => {
                              const newAmount = parseFloat(text) || 0;
                              const totalAmount = parseFloat(amount) || 0;

                              // Temporarily update for current participant to check sum
                              const tempParticipantAmounts = {
                                ...participantAmounts,
                                [member.id]: newAmount,
                              };
                              const tempEnteredAmountParticipants =
                                newAmount > 0 || text === ""
                                  ? [...new Set([...enteredAmountParticipants, member.id])]
                                  : enteredAmountParticipants.filter((id) => id !== member.id);


                              // Calculate sum of all manually entered amounts (including the current temp change)
                              const currentEnteredTotal = selectedParticipants.reduce(
                                (sum, p) =>
                                  sum + (tempEnteredAmountParticipants.includes(p.id) ? tempParticipantAmounts[p.id] || 0 : 0),
                                0
                              );

                              // Only check if currentEnteredTotal exceeds totalAmount *if* the user is actively entering a value
                              if (text !== "" && newAmount > 0 && currentEnteredTotal > totalAmount) {
                                shakeInput(member.id);
                                return; // Prevent updating state if it exceeds total
                              }

                              // Update the amount and mark as manually entered
                              setParticipantAmounts((prev) => ({
                                ...prev,
                                [member.id]: newAmount,
                              }));

                              // Add to enteredAmountParticipants if a value is entered (>0), or remove if it's 0
                              if (newAmount > 0 || text === "") { // Keep it if empty so user can type
                                setEnteredAmountParticipants((prev) => [
                                  ...new Set([...prev, member.id]),
                                ]);
                              } else {
                                  // If the user clears the amount to 0, consider it not manually entered
                                  setEnteredAmountParticipants((prev) =>
                                      prev.filter((id) => id !== member.id)
                                  );
                                  // Additionally, if the amount is explicitly 0, deselect the participant
                                  setSelectedParticipants((prevSelected) =>
                                    prevSelected.filter((p) => p.id !== member.id)
                                  );
                              }
                            }}
                            keyboardType="numeric"
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                          />
                        </Animated.View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-md text-typography-600">No contributors available</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}