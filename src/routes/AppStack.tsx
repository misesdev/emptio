import { stackOptions } from "../constants/RouteSettings"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
import UserMenuScreen from "@screens/root/settings/UserMenuScreen"
import FeedSearchScreen from "@screens/root/orders/search/FeedSearch"
import UserEditScreen from "@screens/root/settings/user/UserEditScreen"
import AboutScreen from "@screens/root/settings/about/AboutScreen"
import ManageSecurityScreen from "@screens/root/settings/security/ManageSecurityScreen"
import AddFolowScreen from "@screens/root/friends/AddFollowScreen"
import DonateScreen from "@screens/root/donate/DonateScreen"
import NewChatScreen from "@screens/root/chats/new/NewChatScreen"
import NewOrderScreen from "@screens/root/orders/new/NewOrderScreen"
import ConversationScreen from "@screens/root/chats/conversation/ConversationScreen"
import ManageFriendsScreen from "@screens/root/friends/ManageFriendsScreen"
import OrderClosureScreen from "@screens/root/orders/new/OrderClosureScreen"
import AuthenticateScreen from "@screens/root/AuthenticateScreen"
import ManageRelaysScreen from "@screens/root/settings/relays/ManageRelaysScreen"
import RelayScreen from "@screens/root/settings/relays/RelayScreen"
import AddRelayScreen from "@screens/root/settings/relays/AddRelayScreen"
import WalletScreen from "@screens/root/wallet/WalletScreen"
import ImportationScreen from "@screens/root/wallet/new/ImportationScreen"
import WalletReceiveScreen from "@screens/root/wallet/receive/WalletReceiveScreen"
import SendScreen from "@screens/root/wallet/send/SendScreen"
import ReceiverScreen from "@screens/root/wallet/send/ReceiverScreen"
import SendFinalScreen from "@screens/root/wallet/send/SendFinalScreen"
import WalletSettings from "@screens/root/wallet/settings/WalletSettings"
import TransactionScreen from "@screens/root/wallet/transaction/TransactionScreen"
import MnemonicScreen from "@screens/root/wallet/new/MnemonicScreen"
import NetworkScreen from "@screens/root/wallet/new/NetworkScreen"
import WalletNameScreen from "@screens/root/wallet/new/WalletNameScreen"
import PassphraseScreen from "@screens/root/wallet/new/PassphraseScreen"
import ConfirmMnemonicScreen from "@screens/root/wallet/new/ConfirmMnemonicScreen"
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
            <Stack.Screen name="wallet-screen" component={WalletScreen} options={{ headerShown: true }} />
            <Stack.Screen name="new-wallet" component={WalletNameScreen} options={{...ScreenCardOptions, headerShown: true}} />
            <Stack.Screen name="import-wallet" component={ImportationScreen} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="wallet-network" component={NetworkScreen} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="wallet-mnemonic" component={MnemonicScreen} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="confirmation-mnemonic" component={ConfirmMnemonicScreen} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="wallet-passphrase" component={PassphraseScreen} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="wallet-receive" component={WalletReceiveScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send" component={SendScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-receiver" component={ReceiverScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-final" component={SendFinalScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-settings" component={WalletSettings} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-transaction" component={TransactionScreen} options={ScreenCardOptions} />

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
