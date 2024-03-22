import { createStackNavigator } from "@react-navigation/stack";

import HomeSearch from "@screens/initial/home/search/HomeSearch";
import Home from "@screens/initial/home";
import theme from "@src/theme";
import { stackOptions } from "@src/constants/RouteSettings";
import UserMenu from "@src/screens/menu";

const Stack = createStackNavigator()

const StackHome = () => {
    return (
        <Stack.Navigator screenOptions={stackOptions} initialRouteName="home-stack">
            <Stack.Screen name="home-stack" component={Home} />
            <Stack.Screen name="search-home"
                component={HomeSearch}
                options={{
                    title: "",
                    headerTintColor: theme.colors.gray
                }}
            />
            <Stack.Screen name="menu-home"
                component={UserMenu}
                options={{
                    title: "",
                    headerTintColor: theme.colors.gray
                }}
            />
        </Stack.Navigator>
    )
}

export default StackHome