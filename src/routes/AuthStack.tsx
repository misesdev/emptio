import { createStackNavigator } from "@react-navigation/stack"
import InitialScreen from "@screens/initial/InitialScreen"
import LoginScreen from "@screens/initial/login/LoginScreen"
import RegisterScreen from "@screens/initial/register/RegisterScreen"
import { stackOptions } from "../constants/RouteSettings"

const Stack = createStackNavigator()

const AuthStack = () => {
    return (
        <Stack.Navigator 
            initialRouteName="initial"
            screenOptions={{ ...stackOptions, headerShown: true }}
        >
            <Stack.Screen 
                name="initial" 
                options={{ headerShown: false }} 
                component={InitialScreen} 
            />
            <Stack.Screen 
                name="login" 
                component={LoginScreen} 
            />
            <Stack.Screen 
                name="register" 
                component={RegisterScreen} 
            />
        </Stack.Navigator>
    )
}

export default AuthStack

