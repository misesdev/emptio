import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import Register from "@screens/renitialize/register";
import Login from "@screens/renitialize/login";
import Initialize from "@src/screens";
import theme from "@src/theme";

const Stack = createStackNavigator()

const InitializeRoutes = () => {
    return (
        <Stack.Navigator screenOptions={stackOptions} initialRouteName="initial-stack">
            <Stack.Screen name="initial-stack" component={Initialize} />
            <Stack.Screen name="register-stack" component={Register} options={{ headerShown: true }}/>
            <Stack.Screen name="login-stack" component={Login} options={{ headerShown: true }} />
        </Stack.Navigator>
    )
}

const stackOptions: StackNavigationOptions = {
    title: "",
    headerShown: false,
    headerTransparent: true,
    headerTintColor: theme.colors.gray,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export default InitializeRoutes