import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import theme from "@src/theme"
import { TabBarOprions } from "../constants/RouteSettings"
import Home from "@screens/root/home"
import Feed from "@screens/root/feed"
import Donate from "@screens/root/donate"
import Settings from "@screens/root/settings"
import { HeaderFeed, HeaderHome } from "@screens/root/headers"
import { useTranslate } from "../services/translate"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {

    return (
        <Tab.Navigator
            screenOptions={TabBarOprions}
            initialRouteName="home"
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    headerShown: true,
                    tabBarLabel: useTranslate("menu.home"),
                    header: ({ navigation }) => <HeaderHome navigation={navigation} />,
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={Feed}
                options={{
                    headerShown: true,
                    tabBarLabel: useTranslate("menu.buy&sell"),
                    header: ({ navigation }) => <HeaderFeed navigation={navigation} />,
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={theme.icons.medium} />,
                }}
            />
            {/* <Tab.Screen
                name="donate"
                component={Donate}
                options={{
                    tabBarLabel: useTranslate("menu.donate"),
                    tabBarIcon: ({ color }) => <Ionicons name="heart" color={color} size={theme.icons.medium} />,
                }}
            /> */}
            <Tab.Screen
                name="settings"
                component={Settings}
                options={{
                    tabBarLabel: useTranslate("menu.setting"),
                    tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={theme.icons.medium} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default TabRoutes

