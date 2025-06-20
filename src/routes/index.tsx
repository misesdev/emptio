import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import { stackOptions } from "../constants/RouteSettings"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
import InitializeScreen from "../screens"
import RegisterScreen from "@screens/initialize/register"
import LoginScreen from "@screens/initialize/login"
import UserMenuScreen from "@screens/root/settings"
import HomeSearchScreen from "@screens/root/home/search/HomeSearch"
import FeedSearchScreen from "@screens/root/orders/search/FeedSearch"
import AuthenticateScreen from "@screens/initialize"
import UserEditScreen from "@screens/root/settings/user"
import ManageRelaysScreen from "@screens/root/settings/relays"
import AboutScreen from "@screens/root/settings/about"
import ManageSecurityScreen from "@screens/root/settings/security"
import WalletManagerScreen from "@screens/root/wallet"
import SendScreen from "@screens/root/wallet/send"
import SendReceiverScreen from "@screens/root/wallet/send/receiver"
import SendFinalScreen from "@screens/root/wallet/send/final"
import WalletSettings from "@screens/root/wallet/settings"
import AddFolowScreen from "@screens/root/friends/add"
import DonateScreen from "@screens/root/donate"
import NewChatScreen from "@screens/root/chats/new"
import WalletReceiveScreen from "@screens/root/wallet/receive"
import ImportWalletScreen from "@screens/root/wallet/import"
import CreatedSeedScren from "@screens/root/wallet/create/seed"
import TransactionScreen from "@screens/root/wallet/transaction"
import NewOrderScreen from "@screens/root/orders/new"
import ConversationChat from "@screens/root/chats/conversation"
import ManageFriendsScreen from "@screens/root/friends"
import RelayScreen from "@screens/root/settings/relays/relay"
import AddRelayScreen from "@screens/root/settings/relays/add"
import OrderClosureScreen from "@screens/root/orders/new/closure"
import NewWalletScreen from "../screens/root/wallet/new"
import CreateWalletScreen from "../screens/root/wallet/create"
import CreateWalletNetwork from "../screens/root/wallet/create/network"
import ImportWalletNetwork from "../screens/root/wallet/import/network"
import ImportWalletMnemonic from "../screens/root/wallet/import/mnemonic"

const Stack = createStackNavigator()

const AppRoutes = () => {

    const ScreenCardOptions = { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }

    return (
        <NavigationContainer >
            <Stack.Navigator 
                screenOptions={stackOptions} 
                initialRouteName="initial-stack"
            >
                <Stack.Screen name="initial-stack" component={InitializeScreen} />
                <Stack.Screen name="authenticate-stack" component={AuthenticateScreen} />
                <Stack.Screen name="login-stack" component={LoginScreen} options={{ headerShown: true }} />
                <Stack.Screen name="register-stack" component={RegisterScreen} options={{ headerShown: true }} />

                <Stack.Screen name="core-stack" component={TabRoutes} />
                <Stack.Screen name="user-donate-stack" component={DonateScreen} options={ScreenCardOptions} />
                <Stack.Screen name="search-home-stack" component={HomeSearchScreen} options={ScreenCardOptions} />
                <Stack.Screen name="search-feed-stack" component={FeedSearchScreen} options={ScreenCardOptions} />

                <Stack.Screen name="new-chat-stack" component={NewChatScreen} options={ScreenCardOptions} />
                <Stack.Screen name="conversation-chat-stack" component={ConversationChat} options={ScreenCardOptions} />

                <Stack.Screen name="user-menu-stack" component={UserMenuScreen} options={{ headerShown: true }} />
                <Stack.Screen name="manage-account-stack" component={UserEditScreen} options={{ headerShown: true }} />

                <Stack.Screen name="manage-relays-stack" component={ManageRelaysScreen} options={ScreenCardOptions} />
                <Stack.Screen name="manage-relay-stack" component={RelayScreen} options={ScreenCardOptions} />
                <Stack.Screen name="add-relay-stack" component={AddRelayScreen} options={ScreenCardOptions} />
                <Stack.Screen name="manage-security-stack" component={ManageSecurityScreen} options={ScreenCardOptions} />
                <Stack.Screen name="about-stack" component={AboutScreen} options={ScreenCardOptions} />

                <Stack.Screen name="wallet" component={WalletManagerScreen} options={{ headerShown: true }} />
                <Stack.Screen name="new-wallet" component={NewWalletScreen} options={ScreenCardOptions} />
                <Stack.Screen name="create-wallet" component={CreateWalletScreen} options={ScreenCardOptions} />
                <Stack.Screen name="create-wallet-network" component={CreateWalletNetwork} options={ScreenCardOptions} />
                <Stack.Screen name="seed-wallet" component={CreatedSeedScren} options={{...ScreenCardOptions, headerShown: true }} />
                <Stack.Screen name="import-wallet" component={ImportWalletScreen} options={ScreenCardOptions} />
                <Stack.Screen name="import-wallet-network" component={ImportWalletNetwork} options={ScreenCardOptions} />
                <Stack.Screen name="import-wallet-mnemonic" component={ImportWalletMnemonic} options={ScreenCardOptions} />
                
                <Stack.Screen name="wallet-receive-stack" component={WalletReceiveScreen} options={ScreenCardOptions} />
                <Stack.Screen name="wallet-send-stack" component={SendScreen} options={ScreenCardOptions} />
                <Stack.Screen name="wallet-send-receiver-stack" component={SendReceiverScreen} options={ScreenCardOptions} />
                <Stack.Screen name="wallet-send-final-stack" component={SendFinalScreen} options={ScreenCardOptions} />
                <Stack.Screen name="wallet-settings-stack" component={WalletSettings} options={ScreenCardOptions} />
                <Stack.Screen name="wallet-transaction-stack" component={TransactionScreen} options={ScreenCardOptions} />

                <Stack.Screen name="add-follow-stack" component={AddFolowScreen} options={ScreenCardOptions} />
                <Stack.Screen name="friends-list-stack" component={ManageFriendsScreen} options={ScreenCardOptions} />

                <Stack.Screen name="feed-order-new" component={NewOrderScreen} options={ScreenCardOptions} />
                <Stack.Screen name="feed-order-ndetails" component={OrderClosureScreen} options={ScreenCardOptions} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppRoutes
