import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import theme from "@src/theme"
import { tabBarStyle } from "../constants/RouteSettings"
import Home from "@screens/root/home"
import Feed from "@screens/root/feed"
import Donate from "@screens/root/donate"
import Settings from "@screens/root/settings"
import { HeaderFeed, HeaderHome } from "@screens/root/headers"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                title: '',
                headerShown: false,
                headerTransparent: true,
                tabBarStyle: tabBarStyle,
                tabBarActiveTintColor: theme.colors.green,
            }}
            initialRouteName="home"
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    headerShown: true,
                    tabBarLabel: "home",
                    header: ({ navigation }) => <HeaderHome navigation={navigation} />,
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={Feed}
                options={{
                    headerShown: true,
                    tabBarLabel: "buy & sell",
                    header: ({ navigation }) => <HeaderFeed navigation={navigation} />,
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="donate"
                component={Donate}
                options={{
                    tabBarLabel: "donate",
                    tabBarIcon: ({ color }) => <Ionicons name="heart" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="settings"
                component={Settings}
                options={{
                    tabBarLabel: "settings",
                    tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={theme.icons.medium} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default TabRoutes

