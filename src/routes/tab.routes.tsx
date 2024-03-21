import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StyleSheet, TouchableOpacity, Text, View } from "react-native"

import theme from "@src/theme"
import Home from "@screens/home/Home"
import Feed from "@screens/home/Feed"
import Donate from "@screens/home/Donate"
import { IconProps } from "./components/Icons"

const Tab = createBottomTabNavigator()

type T = {
    icon: IconProps
}

const TabRoutes = () => {

    const menuItens = [
        { name: "home", label: "home", icon: "home", component: Home },
        { name: "feed", label: "buy & sell", icon: "wallet", component: Feed },
        { name: "donate", label: "donate", icon: "heart", component: Donate }
    ]

    return (
        <Tab.Navigator
            screenOptions={{
                title: '',
                headerTransparent: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.COLORS.GREEN
            }}
            initialRouteName="home"
        >
            {
                menuItens.map((item, key) => {
                    return (
                        <Tab.Screen key={key}
                            name={item.name}
                            component={item.component}
                            options={{
                                tabBarLabel: item.label,
                                tabBarIcon: ({ color }) => <TouchableOpacity><Ionicons name={item.icon} color={color} size={20} /></TouchableOpacity>,
                            }}
                        />
                    )
                })
            }
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: theme.COLORS.TRANSPARENT,
        borderTopColor: theme.COLORS.TRANSPARENT,
        paddingBottom: 15,
        height: 70
    }
})

export default TabRoutes

