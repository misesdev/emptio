import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack";

import HomeSearch from "@screens/home/search/HomeSearch";
import FeedSearch from "@screens/home/search/FeedSearch";
import Home from "../screens/home/Home";
import theme from "../theme";

const Stack = createStackNavigator()

const StackRoutes = () => {
    return (
        <Stack.Navigator screenOptions={options} initialRouteName="home-stack">
            <Stack.Screen name="home-stack" component={Home} />
            <Stack.Screen
                name="search-home"
                component={HomeSearch}
                options={{
                    title: "",
                    headerTintColor: theme.COLORS.GRAY
                }}
            />
            <Stack.Screen
                name="search-feed"
                component={FeedSearch}
                options={{
                    title: "",
                    headerTintColor: theme.COLORS.GRAY
                }}
            />
        </Stack.Navigator>
    )
}

const options: StackNavigationOptions = {
    headerShown: true,
    headerTransparent: true,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
};

export default StackRoutes;