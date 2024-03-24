import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import Register from "@/src/screens/initialize/register";
import Login from "@/src/screens/initialize/login";
import Initialize from "@src/screens";
import theme from "@src/theme";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator()

const InitializeRoutes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={stackOptions} initialRouteName="initial-stack">
                <Stack.Screen name="initial-stack" component={Initialize} />
                <Stack.Screen name="register-stack" component={Register} options={{ headerShown: true }} />
                <Stack.Screen name="login-stack" component={Login} options={{ headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
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