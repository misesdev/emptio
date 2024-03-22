import { ViewStyle } from "react-native";
import theme from "../theme";
import { CardStyleInterpolators, StackNavigationOptions } from "@react-navigation/stack";

export const tabBarStyle: ViewStyle = {
    display: 'flex',
    backgroundColor: theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
    paddingBottom: 15,
    height: 70,        
}

export const stackOptions: StackNavigationOptions = {
    headerShown: true,
    headerTransparent: true,
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
}