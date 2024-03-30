import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import { createStackNavigator } from "@react-navigation/stack"
import InitializeScreen from "../screens"
import RegisterScreen from "@screens/initialize/register"
import LoginScreen from "@screens/initialize/login"
import UserMenuScreen from "@screens/root/menu"
import HomeSearchScreen from "@screens/root/home/search/HomeSearch"
import FeedSearchScreen from "@screens/root/feed/search/FeedSearch"
import AuthenticateScreen from "@screens/initialize"
import { stackOptions } from "../constants/RouteSettings"
import UserEditScreen from "@screens/root/menu/user/edit"
import ManageRelaysScreen from "@screens/root/settings/relays"
import AboutScreen from "@screens/root/settings/about"
import ManageSecurityScreen from "@screens/root/settings/security"
import WalletManagerScreen from "@screens/root/wallet"
import AddWalletScreen from "../screens/root/wallet/add"

const Stack = createStackNavigator()

const AppRoutes = () => {
    return (
        <NavigationContainer >  
             <Stack.Navigator screenOptions={stackOptions} initialRouteName="initial-stack">
                <Stack.Screen name="initial-stack" component={InitializeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="register-stack" component={RegisterScreen} options={{ headerShown: true }} />
                <Stack.Screen name="login-stack" component={LoginScreen} options={{ headerShown: true }} />

                <Stack.Screen name="authenticate-stack" component={AuthenticateScreen} options={{ headerShown: false }} />
                <Stack.Screen name="core-stack" component={TabRoutes} />                
                <Stack.Screen name="search-home-stack" component={HomeSearchScreen} options={{ headerShown: true }}/>
                <Stack.Screen name="search-feed-stack" component={FeedSearchScreen} options={{ headerShown: true }} />   

                <Stack.Screen name="user-menu-stack" component={UserMenuScreen} options={{ headerShown: true }} />  
                <Stack.Screen name="user-edit-stack" component={UserEditScreen} options={{ headerShown: true }} />   

                <Stack.Screen name="manage-relays-stack" component={ManageRelaysScreen} options={{ headerShown: true }} />
                <Stack.Screen name="manage-security-stack" component={ManageSecurityScreen} options={{ headerShown: true }} />
                <Stack.Screen name="about-stack" component={AboutScreen} options={{ headerShown: true }} />     

                <Stack.Screen name="add-wallet-stack" component={AddWalletScreen} options={{ headerShown: true }} />
                <Stack.Screen name="wallet-stack" component={WalletManagerScreen} options={{ headerShown: true }} />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppRoutes