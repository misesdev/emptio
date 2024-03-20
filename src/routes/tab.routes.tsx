import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from "../screens/home/Home"
import Feed from "../screens/home/Feed"
import { StyleSheet } from "react-native"
import theme from "../theme"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions} initialRouteName="home">  
            <Tab.Screen name='home' component={Home}/>
            <Tab.Screen name='feed' component={Feed}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: theme.COLORS.BLACK,
        bottom: 0,
        height: 50
    }
})

const screenOptions : BottomTabNavigationOptions = {
    headerShown: false, 
    tabBarShowLabel: false,
    tabBarStyle: styles.tabBar
}

export default TabRoutes