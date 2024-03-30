import { CardStyleInterpolators, StackNavigationOptions } from "@react-navigation/stack"
import { ViewStyle } from "react-native"
import theme from "../theme"
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"

export const tabBarStyle: ViewStyle = {
    backgroundColor: theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
    paddingBottom: 15,
    height: 70,
    elevation: 0,
}

export const TabBarOprions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarStyle: tabBarStyle,
    tabBarActiveTintColor: theme.colors.blue,
}

export const stackOptions: StackNavigationOptions = {
    title: "",
    headerShown: false,
    headerTransparent: true,
    headerTintColor: theme.colors.white,
    cardStyle: { backgroundColor: theme.colors.black },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

