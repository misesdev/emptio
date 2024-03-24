import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import theme from "@src/theme"
import { tabBarStyle } from "../constants/RouteSettings"
import Home from "@screens/initial/home"
import Feed from "@screens/initial/feed"
import Donate from "@screens/initial/donate"

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
                component={Home}
                options={{
                    tabBarLabel: "home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={Feed}
                options={{
                    tabBarLabel: "buy & sell",
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
        </Tab.Navigator>
    )
}

export default TabRoutes

