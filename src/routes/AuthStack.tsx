import { createStackNavigator } from "@react-navigation/stack"
import InitialScreen from "@screens/initial/InitialScreen"
import LoginScreen from "@screens/initial/login/LoginScreen"
import RegisterScreen from "@screens/initial/register/RegisterScreen"

const Stack = createStackNavigator()

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="initial">
            <Stack.Screen name="initial" component={InitialScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack

