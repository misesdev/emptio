import { stackOptions } from "../constants/RouteSettings"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
import UserMenuScreen from "@screens/root/settings/UserMenuScreen"
import FeedSearchScreen from "@screens/root/orders/search/FeedSearch"
import UserEditScreen from "@screens/root/settings/user/UserEditScreen"
import ManageRelaysScreen from "@screens/root/settings/relays/ManageRelaysScreen"
import AboutScreen from "@screens/root/settings/about/AboutScreen"
import ManageSecurityScreen from "@screens/root/settings/security/ManageSecurityScreen"
import AddFolowScreen from "@screens/root/friends/AddFollowScreen"
import DonateScreen from "@screens/root/donate/DonateScreen"
import NewChatScreen from "@screens/root/chats/new/NewChatScreen"
import NewOrderScreen from "@screens/root/orders/new/NewOrderScreen"
import ConversationScreen from "@screens/root/chats/conversation/ConversationScreen"
import ManageFriendsScreen from "@screens/root/friends/ManageFriendsScreen"
import RelayScreen from "@screens/root/settings/relays/RelayScreen"
import AddRelayScreen from "@screens/root/settings/relays/AddRelayScreen"
import OrderClosureScreen from "@screens/root/orders/new/OrderClosureScreen"
import AuthenticateScreen from "@screens/root/AuthenticateScreen"
import WalletStackNavigation from "./WalletStackNavigation"
import AppTabStack from "./AppTabStack"

const Stack = createStackNavigator()

const AppStack = () => {

    const ScreenCardOptions = { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }

    return (
        <Stack.Navigator 
            screenOptions={stackOptions} 
            initialRouteName="authenticate"
        >
            {/* Initialization */}
            <Stack.Screen name="authenticate" component={AuthenticateScreen} />

            {/* Home */}
            <Stack.Screen name="home" component={AppTabStack} />
            <Stack.Screen name="donate" component={DonateScreen} options={ScreenCardOptions} />
            <Stack.Screen name="search-orders" component={FeedSearchScreen} options={ScreenCardOptions} />

            {/* Chats and conversation */}
            <Stack.Screen name="new-chat" component={NewChatScreen} options={ScreenCardOptions} />
            <Stack.Screen name="conversation" component={ConversationScreen} options={ScreenCardOptions} />

            {/* User Account */}
            <Stack.Screen name="user-menu" component={UserMenuScreen} options={{ headerShown: true }} />
            <Stack.Screen name="manage-account" component={UserEditScreen} options={{ headerShown: true }} />

            {/* Relays */}
            <Stack.Screen name="manage-relays" component={ManageRelaysScreen} options={ScreenCardOptions} />
            <Stack.Screen name="manage-relay" component={RelayScreen} options={ScreenCardOptions} />
            <Stack.Screen name="add-relay" component={AddRelayScreen} options={ScreenCardOptions} />
            <Stack.Screen name="manage-security" component={ManageSecurityScreen} options={ScreenCardOptions} />

            {/* Wallet  */}
            <Stack.Screen name="wallet-stack" component={WalletStackNavigation} /> 

            {/* Manage Friends */}
            <Stack.Screen name="add-follow" component={AddFolowScreen} options={ScreenCardOptions} />
            <Stack.Screen name="friends-list" component={ManageFriendsScreen} options={ScreenCardOptions} />

            {/* Orders */}
            <Stack.Screen name="orders-new" component={NewOrderScreen} options={ScreenCardOptions} />
            <Stack.Screen name="orders-ndetails" component={OrderClosureScreen} options={ScreenCardOptions} />

            {/* App */}
            <Stack.Screen name="about" component={AboutScreen} options={ScreenCardOptions} />
        </Stack.Navigator>
    )
}

export default AppStack
