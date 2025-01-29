import { CardStyleInterpolators, StackNavigationOptions } from "@react-navigation/stack"
import { ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ionicons from "react-native-vector-icons/Ionicons"
import theme from "../theme"

export const tabBarStyle: ViewStyle = {
    backgroundColor: theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
    paddingBottom: 15,
    height: 70,
    elevation: 0,
}

export const stackOptions: StackNavigationOptions = {
    title: "",
    headerShown: false,
    headerTransparent: true,
    /* headertintcolor: theme.colors.white, */
    headerLeft: (props: any) => {
        return (
            <TouchableOpacity onPress={() => props?.onPress()} 
                style={{ marginLeft: 10, borderRadius: 50, padding: 8, backgroundColor: theme.colors.semitransparent }} 
                activeOpacity={.7}
            >
                <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
            </TouchableOpacity>
        )
    },
    cardStyle: { backgroundColor: theme.colors.black },
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    /* headerStyle: { height: 50, backgroundColor: theme.colors.black }, */
    headerShadowVisible: false,
}

