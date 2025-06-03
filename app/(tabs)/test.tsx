import { initDatabase } from "@/db/initdb";
import SchemaView from "@/db/schemaView";
import { useSQLiteContext } from "expo-sqlite";
import { Text, TouchableOpacity, View } from "react-native";

export default function Test() {
    const db = useSQLiteContext();

    const handleResetDatabase = async () => {
        try {
            console.log("Resetting database...");
            await initDatabase(db);
            console.log("Database reset successfully");
        } catch (error) {
            console.error("Failed to reset database:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={handleResetDatabase}
                style={{
                    backgroundColor: "#007AFF",
                    padding: 10,
                    margin: 10,
                    borderRadius: 5,
                }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    Reset Database
                </Text>
            </TouchableOpacity>
            <SchemaView />
        </View>
    );
}