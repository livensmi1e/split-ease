import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function TabbarButton({
    children,
    onPress,
}: {
    children?: any;
    onPress?: any;
}) {
    return (
        <TouchableOpacity
            style={{
                top: -3,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#7F5DF0",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
                elevation: 5,
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: "#1D63ED",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </View>
        </TouchableOpacity>
    );
}
