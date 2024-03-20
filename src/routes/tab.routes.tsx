import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import theme from "../theme"
import Home from "../screens/home/Home"
import Feed from "../screens/home/Feed"
import Donate from "../screens/home/Donate"

const Tab = createMaterialBottomTabNavigator()

const TabRoutes = () => {
    return (
        <Tab.Navigator
            activeColor={theme.COLORS.GREEN}
            inactiveColor={theme.COLORS.WHITE}
            barStyle={{ backgroundColor: theme.COLORS.TRANSPARENT }}
            initialRouteName="home"
        >
            <Tab.Screen
                name='home'
                component={Home}
                options={{
                    tabBarLabel: "home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={18} />
                }}
            />
            <Tab.Screen
                name='feed'
                component={Feed}
                options={{
                    tabBarLabel: "buy & sell",
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={18} />
                }}
            />
            <Tab.Screen
                name='donate'
                component={Donate}
                options={{
                    tabBarLabel: "donate",
                    tabBarIcon: ({ color }) => <Ionicons name="heart" color={color} size={18} />
                }}
            />
        </Tab.Navigator>
    )
}

export default TabRoutes

