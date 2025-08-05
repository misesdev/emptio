import { stackOptions } from "../constants/RouteSettings"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
import UserMenuScreen from "@screens/root/settings/UserMenuScreen"
import HomeSearchScreen from "@screens/root/home/search/HomeSearch"
import FeedSearchScreen from "@screens/root/orders/search/FeedSearch"
import UserEditScreen from "@screens/root/settings/user/UserEditScreen"
import ManageRelaysScreen from "@screens/root/settings/relays/ManageRelaysScreen"
import AboutScreen from "@screens/root/settings/about/AboutScreen"
import ManageSecurityScreen from "@screens/root/settings/security/ManageSecurityScreen"
import WalletScreen from "@screens/root/wallet/WalletScreen"
import SendScreen from "@screens/root/wallet/send/SendScreen"
import ReceiverScreen from "@screens/root/wallet/send/ReceiverScreen"
import SendFinalScreen from "@screens/root/wallet/send/SendFinalScreen"
import WalletSettings from "@screens/root/wallet/settings/WalletSettings"
import AddFolowScreen from "@screens/root/friends/AddFollowScreen"
import DonateScreen from "@screens/root/donate/DonateScreen"
import NewChatScreen from "@screens/root/chats/new/NewChatScreen"
import WalletReceiveScreen from "@screens/root/wallet/receive/WalletReceiveScreen"
import TransactionScreen from "@screens/root/wallet/transaction/TransactionScreen"
import NewOrderScreen from "@screens/root/orders/new/NewOrderScreen"
import ConversationScreen from "@screens/root/chats/conversation/ConversationScreen"
import ManageFriendsScreen from "@screens/root/friends/ManageFriendsScreen"
import RelayScreen from "@screens/root/settings/relays/RelayScreen"
import AddRelayScreen from "@screens/root/settings/relays/AddRelayScreen"
import OrderClosureScreen from "@screens/root/orders/new/OrderClosureScreen"
import NewWalletScreen from "@screens/root/wallet/NewWalletScreen"
import CreateWalletScreen from "@screens/root/wallet/create/WalletName"
import CreateWalletNetwork from "@screens/root/wallet/create/WalletNetwork"
import CreateWalletMnemonic from "@screens/root/wallet/create/WalletMnemonic"
import CreateWalletPassphrase from "@screens/root/wallet/create/WalletPassphrase"
import ImportWalletScreen from "@screens/root/wallet/import/WalletName"
import ImportWalletNetwork from "@screens/root/wallet/import/WalletNetwork"
import ImportWalletMnemonic from "@screens/root/wallet/import/WalletMnemonic"
import AuthenticateScreen from "@screens/root/AuthenticateScreen"
import AppTabStack from "./AppTabStack"

const Stack = createStackNavigator()

const AppStack = () => {

    const ScreenCardOptions = { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }

    return (
        <Stack.Navigator 
            screenOptions={stackOptions} 
            initialRouteName="authenticate"
        >
            <Stack.Screen name="authenticate" component={AuthenticateScreen} />

            <Stack.Screen name="home" component={AppTabStack} />
            <Stack.Screen name="donate" component={DonateScreen} options={ScreenCardOptions} />
            <Stack.Screen name="search-home" component={HomeSearchScreen} options={ScreenCardOptions} />
            <Stack.Screen name="search-orders" component={FeedSearchScreen} options={ScreenCardOptions} />

            <Stack.Screen name="new-chat" component={NewChatScreen} options={ScreenCardOptions} />
            <Stack.Screen name="conversation" component={ConversationScreen} options={ScreenCardOptions} />

            <Stack.Screen name="user-menu" component={UserMenuScreen} options={{ headerShown: true }} />
            <Stack.Screen name="manage-account" component={UserEditScreen} options={{ headerShown: true }} />

            <Stack.Screen name="manage-relays" component={ManageRelaysScreen} options={ScreenCardOptions} />
            <Stack.Screen name="manage-relay" component={RelayScreen} options={ScreenCardOptions} />
            <Stack.Screen name="add-relay" component={AddRelayScreen} options={ScreenCardOptions} />
            <Stack.Screen name="manage-security" component={ManageSecurityScreen} options={ScreenCardOptions} />
            <Stack.Screen name="about" component={AboutScreen} options={ScreenCardOptions} />

            <Stack.Screen name="wallet" component={WalletScreen} options={{ headerShown: true }} />
            <Stack.Screen name="new-wallet" component={NewWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="create-wallet" component={CreateWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="create-wallet-network" component={CreateWalletNetwork} options={ScreenCardOptions} />
            <Stack.Screen name="create-wallet-mnemonic" component={CreateWalletMnemonic} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="create-wallet-passphrase" component={CreateWalletPassphrase} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="import-wallet" component={ImportWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="import-wallet-network" component={ImportWalletNetwork} options={ScreenCardOptions} />
            <Stack.Screen name="import-wallet-mnemonic" component={ImportWalletMnemonic} options={ScreenCardOptions} />
            
            <Stack.Screen name="wallet-receive" component={WalletReceiveScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send" component={SendScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-receiver" component={ReceiverScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-final" component={SendFinalScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-settings" component={WalletSettings} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-transaction" component={TransactionScreen} options={ScreenCardOptions} />

            <Stack.Screen name="add-follow" component={AddFolowScreen} options={ScreenCardOptions} />
            <Stack.Screen name="friends-list" component={ManageFriendsScreen} options={ScreenCardOptions} />

            <Stack.Screen name="orders-new" component={NewOrderScreen} options={ScreenCardOptions} />
            <Stack.Screen name="orders-ndetails" component={OrderClosureScreen} options={ScreenCardOptions} />
        </Stack.Navigator>
    )
}

export default AppStack
