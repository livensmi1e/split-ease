import AddExpenseButton from "@/components/AddExpenseButton";
import ExpensesList from "@/components/ExpensesList";
import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import MemberBalancesList from "@/components/MemberBalancesList";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    BackHandler,
    Easing,
    Image,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
// Fake data function for now
const getGroupDataById = (id: string | string[] | undefined) => {
    return {
        title: `Trip ${id}`,
        numMembers: 3,
        numExpenses: 4,
        image: require("@/assets/images/trip-placeholder.png"),
        members: [
            { id: "1", pays: 10, owes: 20, memberName: "Member 1" },
            { id: "2", pays: 10, owes: 20, memberName: "Member 2" },
            { id: "3", pays: 10, owes: 20, memberName: "Member 3" },
        ],
        balances: [
            {
                id: "1",
                owner: "Member 1",
                target: "Member 2",
                amount: 10,
                isMe: false,
            },
            {
                id: "2",
                owner: "Member 1",
                target: "Member 3",
                amount: 10,
                isMe: true,
            },
        ],
    };
};

const ExpensesRoute = () => (
    <View className="flex-1 bg-white p-4">
        <Text className="text-lg mb-4">Expenses content</Text>
        <ExpensesList />
    </View>
);

const BalancesRoute = ({ group }: { group: any }) => (
    <View className="flex-1 bg-white px-4 pt-4">
        <Text className="text-typography-700 font-medium text-base mb-4">
            Pending Balances
        </Text>
        <View className="mb-6">
            <MarkAsPaidsList balances={group.balances} />
        </View>
        <Text className="text-typography-700 font-medium text-base mb-4">
            See group member balances
        </Text>
        <View>
            <MemberBalancesList members={group.members} />
        </View>
    </View>
);

const PhotosRoute = () => (
    <View className="flex-1 bg-white p-6 items-center">
        <View className="w-24 h-24 rounded-full bg-primary-0 items-center justify-center mb-6 p-3">
            <Ionicons name="camera-outline" size={48} color="#000" />
        </View>
        <Text className="text-lg font-semibold mb-2 text-typography-900">
            Start sharing photos
        </Text>
        <Text className="text-center text-typography-700 px-8">
            Add a photo by tapping on the camera to start sharing
        </Text>
    </View>
);

const routes = [
    { key: "expenses", title: "Expenses" },
    { key: "balances", title: "Balances" },
    { key: "photos", title: "Photos" },
];

export default function GroupDetail() {
    const { id } = useLocalSearchParams();
    const group = getGroupDataById(id); // Mock function - Need to be replaced by actual function
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case "expenses":
                return <ExpensesRoute />;
            case "balances":
                return <BalancesRoute group={group} />;
            case "photos":
                return <PhotosRoute />;
            default:
                return null;
        }
    };

    const renderTabBar = () => (
        <View className="flex-row bg-background-50 rounded-xl p-2 my-4 mx-2">
            {routes.map((route, i) => {
                const focused = i === index;
                return (
                    <Pressable
                        key={route.key}
                        className={`flex-1 py-3 rounded-xl items-center ${
                            focused ? "bg-blue-600" : ""
                        }`}
                        onPress={() => setIndex(i)}
                    >
                        <Text
                            className={`text-sm ${
                                focused ? "text-white font-bold" : "text-black"
                            }`}
                        >
                            {route.title}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    const fadeAndNavigate = (action: any) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            action();
            fadeAnim.setValue(1);
        });
    };

    const backAction = () => {
        fadeAndNavigate(() => router.back());
        return true;
    };

    const updateAction = () =>
        router.push({
            pathname: "/groups/update",
            params: { id: Array.isArray(id) ? id[0] : id ?? "" },
        });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    const renderHeader = () => (
        <View className="mb-2">
            <View className="flex-row items-top pt-4 justify-between h-24 rounded-t-xl px-4 bg-primary-300">
                <Pressable onPress={backAction}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </Pressable>
                <Pressable onPress={updateAction}>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color="#000000"
                    />
                </Pressable>
            </View>
            <View className="px-8 -mt-10">
                <Image
                    source={group.image}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: "white",
                    }}
                />
            </View>
            <View className="bg-white px-8">
                <Text className="font-bold text-xl text-typography-950">
                    {group.title}
                </Text>
                <View className="flex-row mt-1">
                    <Text className="text-xs text-typography-950">
                        {group.numMembers} members
                    </Text>
                    <Text className="text-xs text-typography-950 px-2">
                        {group.numExpenses} expenses
                    </Text>
                </View>
            </View>
        </View>
    );

    const addExpense = () => {
        router.push({
            pathname: "/expenses/create",
            params: { groupId: Array.isArray(id) ? id[0] : id ?? "" }
        });
    };

    return (
        <SafeAreaView className="bg-white h-full flex-1">
            <Animated.View style={{ opacity: fadeAnim }}>
                {renderHeader()}
            </Animated.View>
            {renderTabBar()}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={() => null}
            />
            <View className="absolute bottom-16 right-8">
                <AddExpenseButton onPress={addExpense} />
            </View>
        </SafeAreaView>
    );
}

