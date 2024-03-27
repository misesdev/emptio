import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import { createStackNavigator } from "@react-navigation/stack"
import Initialize from "../screens"
import Register from "@screens/initialize/register"
import Login from "@screens/initialize/login"
import UserMenu from "@screens/root/menu"
import HomeSearch from "@screens/root/home/search/HomeSearch"
import FeedSearch from "@screens/root/feed/search/FeedSearch"
import Authenticate from "@screens/initialize"
import { stackOptions } from "../constants/RouteSettings"
import UserEdit from "@screens/root/menu/user/edit"
import ManageRelays from "@screens/root/settings/relays"
import About from "@screens/root/settings/about"
import ManageSecurity from "@screens/root/settings/security"

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
                <Stack.Screen name="search-home-stack" component={HomeSearch} options={{ headerShown: true }}/>
                <Stack.Screen name="search-feed-stack" component={FeedSearch} options={{ headerShown: true }} />   

                <Stack.Screen name="user-menu-stack" component={UserMenu} options={{ headerShown: true }} />  
                <Stack.Screen name="user-edit-stack" component={UserEdit} options={{ headerShown: true }} />   

                <Stack.Screen name="manage-relays-stack" component={ManageRelays} options={{ headerShown: true }} />
                <Stack.Screen name="manage-security-stack" component={ManageSecurity} options={{ headerShown: true }} />
                <Stack.Screen name="about-stack" component={About} options={{ headerShown: true }} />     
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppRoutes