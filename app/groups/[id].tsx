import AddExpenseButton from "@/components/AddExpenseButton";
import ExpensesList from "@/components/ExpensesList";
import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import MemberBalancesList from "@/components/MemberBalancesList";
import { getMemberBalancesByGroupId, getWhoOwesWhoByGroupId } from "@/core/expenses";
import { getGroup } from "@/core/groups";
import { MarkAsPaidProps, MemberBalanceProps } from "@/types/balance";
import { GroupItemProps, RowData } from "@/types/group";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
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

const ExpensesRoute = () => {
    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-lg mb-4">Expenses content</Text>
            <ExpensesList />
        </View>
    );
}

const EmptyCard = ({ message }: { message: string }) => (
    <View className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
        <Text className="text-center text-gray-500">{message}</Text>
    </View>
);

const BalancesRoute = ({ group }: { group: any }) => {
    const [balances, setBalances] = useState<MemberBalanceProps[]>([]);
    const [whoOwesWho, setWhoOwesWho] = useState<MarkAsPaidProps[]>([]);
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const groupID = Array.isArray(id) ? id[0] : id;

    const loadBalanceData = async () => {
        try {
            const memberBalances = await getMemberBalancesByGroupId(db, groupID);
            const owesData = await getWhoOwesWhoByGroupId(db, parseInt(groupID));

            const transformedBalances: MemberBalanceProps[] = memberBalances.map((balance: RowData) => ({
                id: balance.member_id.toString(),
                memberName: balance.name,
                pays: balance.total_paid || 0,
                owes: balance.total_owed || 0
            }));
            setBalances(transformedBalances);

            const transformedOwesData: MarkAsPaidProps[] = owesData.map((owe: RowData, index: number) => ({
                id: index.toString(),
                owner: owe.creditor_name,
                target: owe.debtor_name,
                amount: owe.amount,
                isMe: false,
                debtorId: owe.from_member_id,
                creditorId: owe.to_member_id
            }));
            setWhoOwesWho(transformedOwesData);
        } catch (error) {
            console.error("Failed to load balance data:", error);
        }
    };

    useEffect(() => {
        loadBalanceData();
    }, [groupID]);

    return (
        <View className="flex-1 bg-white px-4 pt-4">
            <Text className="text-typography-700 font-medium text-base mb-4">
                Pending Balances
            </Text>
            <View className="mb-6">
                {whoOwesWho.length > 0 ? (
                    <MarkAsPaidsList balances={whoOwesWho} onBalanceUpdate={loadBalanceData} />
                ) : (
                    <EmptyCard message="No pending balances found." />
                )}
            </View>

            <Text className="text-typography-700 font-medium text-base mb-4">
                See group member balances
            </Text>
            <View>
                {balances.length > 0 ? (
                    <MemberBalancesList members={balances} />
                ) : (
                    <EmptyCard message="No member balances available." />
                )}
            </View>
        </View>
    );
};

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
    // const group = getGroupDataById(id); // Mock function - Need to be replaced by actual function
    const [group, setGroup] = useState<GroupItemProps>()
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const db = useSQLiteContext();
    const groupID = Array.isArray(id) ? id[0] : id;
    useEffect(() => {
        const loadGroupData = async () => {
            try {
                // await db.runAsync("DELETE FROM expense")
                // await db.runAsync("Delete from settlement")
                const res = await getGroup(db, groupID);
                if (res) {
                    const formattedData: GroupItemProps = res.map(
                        (row: RowData) => {
                            return {
                                id: row.id as number,
                                name: row.name as string,
                                activityCount: row.activityCount as number,
                                memberCount: row.memberCount as number,
                                totalExpense: row.totalAmount
                                    ? (row.totalAmount as number)
                                    : 0,
                                myExpense: 0,
                                isCompleted: false,
                                avatar: require("@/assets/images/trip-placeholder.png"),
                            };
                        }
                    )[0];
                    // console.log(formattedData);
                    setGroup(formattedData);
                }
            }
            catch (error) {
                console.error("Fail go get group data: ", error)
            }
        }

        loadGroupData();
    }, [id])

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
                        className={`flex-1 py-3 rounded-xl items-center ${focused ? "bg-blue-600" : ""
                            }`}
                        onPress={() => setIndex(i)}
                    >
                        <Text
                            className={`text-sm ${focused ? "text-white font-bold" : "text-black"
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
            <View className="flex-row items-center pt-4 justify-between h-24 rounded-t-xl px-4 bg-primary-300">
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
                    source={group?.avatar}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: "white",
                    }}
                />
            </View>
            <View className="bg-white px-8 pb-4">
                <Text className="font-bold text-xl text-typography-950">
                    {group?.name}
                </Text>
                <View className="flex-row mt-1">
                    <Text className="text-xs text-typography-950">
                        {group?.memberCount} members
                    </Text>
                    <Text className="text-xs text-typography-950 px-2">
                        {group?.activityCount} expenses
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