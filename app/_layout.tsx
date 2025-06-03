import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { initDatabase } from "@/db/initdb";
import "@/global.css";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Stack, useNavigationContainerRef } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import { StatusBar } from "react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
    dsn: "https://a518137a19664166ede942be11b20eb7@o4509436494872576.ingest.de.sentry.io/4509436496576592",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),
});

function RootLayout() {
    const ref = useNavigationContainerRef();
    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);
    return (
        <SQLiteProvider databaseName="mydb.db" onInit={initDatabase}>
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

export default Sentry.wrap(RootLayout);
