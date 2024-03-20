import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import Initialize from "../screens";

const Stack = createStackNavigator()

const StackRoutes = () => {
    return (
        <Stack.Navigator screenOptions={options}  initialRouteName="initialize">
            <Stack.Screen name="initialize" component={Initialize}/>
        </Stack.Navigator>
    )
}

const options : StackNavigationOptions = {
    headerShown: false, 
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
};

export default StackRoutes;