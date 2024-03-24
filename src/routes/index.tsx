import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack"
import theme from "../theme"
import Initialize from "../screens"
import Register from "@screens/initialize/register"
import Login from "@screens/initialize/login"
import UserMenu from "../screens/menu"
import HomeSearch from "@screens/initial/home/search/HomeSearch"
import FeedSearch from "@screens/initial/feed/search/FeedSearch"
import Authenticate from "../screens/initialize"

const Stack = createStackNavigator()

const AppRoutes = () => {
    return (
        <NavigationContainer >  
             <Stack.Navigator screenOptions={stackOptions} initialRouteName="initial-stack">
                <Stack.Screen name="initial-stack" component={Initialize} />
                <Stack.Screen name="register-stack" component={Register} options={{ headerShown: true }} />
                <Stack.Screen name="login-stack" component={Login} options={{ headerShown: true }} />

                <Stack.Screen name="authenticate-stack" component={Authenticate} options={{ headerShown: false }} />
                <Stack.Screen name="core-stack" component={TabRoutes} options={{ headerShown: false }} />
                <Stack.Screen name="user-menu-stack" component={UserMenu} options={{ headerShown: true }} />
                <Stack.Screen name="search-home-stack" component={HomeSearch} options={{ headerShown: true }}/>
                <Stack.Screen name="search-feed-stack" component={FeedSearch} options={{ headerShown: true }} />                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const stackOptions: StackNavigationOptions = {
    title: "",
    headerShown: false,
    headerTransparent: true,
    headerTintColor: theme.colors.gray,
    cardStyle: { backgroundColor: theme.colors.black },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export default AppRoutes