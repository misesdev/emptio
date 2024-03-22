import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import Initialize from "@src/screens";

const Stack = createStackNavigator()

const InitializeRoutes = () => {
    return (
        <Stack.Navigator screenOptions={stackOptions} initialRouteName="initial-stack">
            <Stack.Screen name="initial-stack" component={Initialize} />
        </Stack.Navigator>
    )
}

const stackOptions: StackNavigationOptions = {
    headerShown: false,
    headerTransparent: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export default InitializeRoutes