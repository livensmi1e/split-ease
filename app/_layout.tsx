import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { initDatabase } from "@/db/initdb";
import "@/global.css";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return (
        <SQLiteProvider 
            databaseName="mydb.db" 
            onInit={async (db) => {
                try {
                    console.log("Initializing database...");
                    await initDatabase(db);
                    console.log("Database initialized successfully");
                } catch (error) {
                    console.error("Failed to initialize database:", error);
                    // You might want to show an error message to the user here
                }
            }}
        >
            <GluestackUIProvider mode="light">
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#FFFFFF"
                    translucent={false}
                />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen
                        name="splash"
                        options={{ gestureEnabled: false }}
                    />
                    <Stack.Screen name="onboard" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </GluestackUIProvider>
        </SQLiteProvider>
    );
}
