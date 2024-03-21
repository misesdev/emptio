import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StyleSheet } from "react-native"

import theme from "@src/theme"
import Home from "@screens/home/Home"
import Feed from "@screens/home/Feed"
import Donate from "@screens/home/Donate"
import { IconProps } from "./components/Icons"
import StackRoutes from "./stack.routes"
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors"

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
            <Tab.Screen
                name="home"
                component={StackRoutes}
                options={{
                    headerShown: false,
                    tabBarLabel: "home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={20} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={Feed}
                options={{
                    tabBarLabel: "buy & sell",
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={20} />,
                }}
            />
            <Tab.Screen
                name="donate"
                component={Donate}
                options={{
                    tabBarLabel: "donate",
                    tabBarIcon: ({ color }) => <Ionicons name="heart" color={color} size={20} />,
                }}
            />
            {/* {
                menuItens.map((item, key) => {
                    return (
                        <Tab.Screen key={key}
                            name={item.name}
                            component={item.component}
                            options={{
                                tabBarLabel: item.label,
                                tabBarIcon: ({ color }) => <Ionicons name={item.icon} color={color} size={20} />,
                            }}
                        />
                    )
                })
            } */}
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

