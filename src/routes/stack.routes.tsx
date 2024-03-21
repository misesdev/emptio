import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import Initialize from "../screens";
import HomeSearch from "../screens/home/search/HomeSearch";
import TabRoutes from "./tab.routes";

const Stack = createStackNavigator()

const StackRoutes = () => {
    return (
        <Stack.Navigator screenOptions={options}  initialRouteName="initialize">
            <Stack.Screen name="initialize" component={Initialize}/>
            <Stack.Screen name="search-home" component={HomeSearch}/>
            <Stack.Screen name="menu" component={TabRoutes}/>
        </Stack.Navigator>
    )
}

const options : StackNavigationOptions = {
    headerShown: false, 
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
};

export default StackRoutes;