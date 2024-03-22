import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import StackHome from "./home"
import StackFeed from "./feed"
import theme from "@src/theme"
import Donate from "@/src/screens/initial/donate"
import { tabBarStyle } from "../constants/RouteSettings"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                title: '',
                headerTransparent: true,
                tabBarStyle: tabBarStyle,
                tabBarActiveTintColor: theme.colors.green,
            }}
            initialRouteName="home"
        >
            <Tab.Screen
                name="home"
                component={StackHome}
                options={{
                    headerShown: false,
                    tabBarLabel: "home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={StackFeed}
                options={{
                    headerShown: false,
                    tabBarLabel: "buy & sell",
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="donate"
                component={Donate}
                options={{
                    headerShown: false,
                    tabBarLabel: "donate",
                    tabBarIcon: ({ color }) => <Ionicons name="heart" color={color} size={theme.icons.medium} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default TabRoutes

