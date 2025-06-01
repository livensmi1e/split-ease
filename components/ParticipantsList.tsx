import { Participant } from "@/types/group";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

interface ParticipantListProps {
  onChange: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export default function ParticipantList({ onChange }: ParticipantListProps) {
    const [participants, setParticipants] = useState([
    { id: Date.now(), name: "" },
    ]);

    useEffect(() => {
        onChange(participants);
    }, [participants]);
    const handleAdd = () => {
    setParticipants((prev) => [...prev, { id: Date.now(), name: "" }]);
    };

    const handleRemove = (id: number) => {
    setParticipants((prev) => prev.filter((item) => item.id !== id));
    };

    const handleChangeText = (id: number, newName: string) => {
    setParticipants((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
    };

    return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {participants.map((item) => (
          <View key={item.id} style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={item.name}
              onChangeText={(text) => handleChangeText(item.id, text)}
            />
            <TouchableOpacity
              onPress={() => handleRemove(item.id)}
              style={styles.removeBtn}
            >
              <Text style={{ color: "red" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
        <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
          Add Participant
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    maxHeight: 400, // tránh ScrollView bị vô hạn
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 6,
  },
  addButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
});
