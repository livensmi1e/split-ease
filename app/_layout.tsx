import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return (
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
    );
}
