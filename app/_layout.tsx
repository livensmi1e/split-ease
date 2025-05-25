import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <GluestackUIProvider mode="light">
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                    name="splash"
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="onboard" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </GluestackUIProvider>
    );
}
