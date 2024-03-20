import { NavigationContainer } from "@react-navigation/native"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"

import Initialize from "../screens"

const Stack = createStackNavigator()

const AppRoutes = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={options} initialRouteName="initialize">

                <Stack.Screen name="initialize" component={Initialize} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

const options = {
    headerShown: false, 
    headerTransparent: true, 
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
};

export default AppRoutes