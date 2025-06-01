import ExpensesList from "@/components/ExpensesList";
import MarkAsPaidsList from "@/components/MarkAsPaidsList";
import MemberBalancesList from "@/components/MemberBalancesList";
import SchemaView from "@/db/schemaView";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";

const balances = [
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
];

const members = [
    {
        id: "1",
        pays: 10,
        owes: 20,
        memberName: "Member 1",
    },
    {
        id: "2",
        pays: 10,
        owes: 20,
        memberName: "Member 2",
    },
    {
        id: "3",
        pays: 10,
        owes: 20,
        memberName: "Member 3",
    },
];

const ExpensesRoute = () => (
    <View className="flex-1 bg-white p-4">
        <Text className="text-lg mb-4">Expenses content</Text>
        <ExpensesList></ExpensesList>
    </View>
);

const BalancesRoute = () => (
    <View className="flex-1 bg-white px-4 pt-4">
        {/* Heading: Pending Balances */}
        <Text className="text-typography-700 font-medium text-base mb-4">
            Pending Balances
        </Text>
        <View className="mb-6">
            <MarkAsPaidsList balances={balances} />
        </View>
        {/* Heading: Member Balances */}
        <Text className="text-typography-700 font-medium text-base mb-4">
            See group member balances
        </Text>
        <View>
            <MemberBalancesList members={members} />
        </View>
    </View>
);

const PhotosRoute = () => (
    <View className="flex-1 bg-white p-6 items-center">
        {/* Camera icon */}
        <View className="w-24 h-24 rounded-full bg-primary-0 items-center justify-center mb-6 p-3">
            <Ionicons name="camera-outline" size={48} color="#000" />
        </View>
        {/* Title */}
        <Text className="text-lg font-semibold mb-2 text-typography-900">
            Start sharing photos
        </Text>
        {/* Description */}
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

// export default function Test() {
//     const layout = useWindowDimensions();
//     const [index, setIndex] = useState(0);
//     const renderScene = ({ route }: { route: { key: string } }) => {
//         switch (route.key) {
//             case "expenses":
//                 return <ExpensesRoute />;
//             case "balances":
//                 return <BalancesRoute />;
//             case "photos":
//                 return <PhotosRoute />;
//             default:
//                 return null;
//         }
//     };
//     const renderTabBar = () => (
//         <View className="flex-row bg-background-50 rounded-xl p-2 my-4 mx-2">
//             {routes.map((route, i) => {
//                 const focused = i === index;
//                 return (
//                     <Pressable
//                         key={route.key}
//                         className={`flex-1 py-3 rounded-xl items-center ${
//                             focused ? "bg-blue-600" : ""
//                         }`}
//                         onPress={() => setIndex(i)}
//                     >
//                         <Text
//                             className={`text-sm ${
//                                 focused ? "text-white font-bold" : "text-black"
//                             }`}
//                         >
//                             {route.title}
//                         </Text>
//                     </Pressable>
//                 );
//             })}
//         </View>
//     );

//     return (
//         <SafeAreaView className="bg-white h-full flex-1">
//             {renderTabBar()}
//             <TabView
//                 navigationState={{ index, routes }}
//                 renderScene={renderScene}
//                 onIndexChange={setIndex}
//                 initialLayout={{ width: layout.width }}
//                 renderTabBar={() => null}
//             />
//         </SafeAreaView>
//     );
// }
export default function Test(){
    return <SchemaView/>
}