import { stackOptions } from "../constants/RouteSettings"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
import UserMenuScreen from "@screens/root/settings/UserMenuScreen"
import HomeSearchScreen from "@screens/root/home/search/HomeSearch"
import FeedSearchScreen from "@screens/root/orders/search/FeedSearch"
import UserEditScreen from "@screens/root/settings/user/UserEditScreen"
import ManageRelaysScreen from "@screens/root/settings/relays/ManageRelaysScreen"
import AboutScreen from "@screens/root/settings/about/AboutScreen"
import ManageSecurityScreen from "@screens/root/settings/security/ManageSecurityScreen"
import WalletManagerScreen from "@screens/root/wallet"
import SendScreen from "@screens/root/wallet/send"
import SendReceiverScreen from "@screens/root/wallet/send/receiver"
import SendFinalScreen from "@screens/root/wallet/send/final"
import WalletSettings from "@screens/root/wallet/settings"
import AddFolowScreen from "@screens/root/friends/AddFollowScreen"
import DonateScreen from "@screens/root/donate/DonateScreen"
import NewChatScreen from "@screens/root/chats/new/NewChatScreen"
import WalletReceiveScreen from "@screens/root/wallet/receive"
import ImportWalletScreen from "@screens/root/wallet/import"
import CreatedSeedScren from "@screens/root/wallet/create/seed"
import TransactionScreen from "@screens/root/wallet/transaction"
import NewOrderScreen from "@screens/root/orders/new/NewOrderScreen"
import ConversationScreen from "@screens/root/chats/conversation/ConversationScreen"
import ManageFriendsScreen from "@screens/root/friends/ManageFriendsScreen"
import RelayScreen from "@screens/root/settings/relays/RelayScreen"
import AddRelayScreen from "@screens/root/settings/relays/AddRelayScreen"
import OrderClosureScreen from "@screens/root/orders/new/OrderClosureScreen"
import NewWalletScreen from "@screens/root/wallet/new"
import CreateWalletScreen from "@screens/root/wallet/create"
import CreateWalletNetwork from "@screens/root/wallet/create/network"
import ImportWalletNetwork from "@screens/root/wallet/import/network"
import ImportWalletMnemonic from "@screens/root/wallet/import/mnemonic"
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

            <Stack.Screen name="wallet" component={WalletManagerScreen} options={{ headerShown: true }} />
            <Stack.Screen name="new-wallet" component={NewWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="create-wallet" component={CreateWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="create-wallet-network" component={CreateWalletNetwork} options={ScreenCardOptions} />
            <Stack.Screen name="seed-wallet" component={CreatedSeedScren} options={{...ScreenCardOptions, headerShown: true }} />
            <Stack.Screen name="import-wallet" component={ImportWalletScreen} options={ScreenCardOptions} />
            <Stack.Screen name="import-wallet-network" component={ImportWalletNetwork} options={ScreenCardOptions} />
            <Stack.Screen name="import-wallet-mnemonic" component={ImportWalletMnemonic} options={ScreenCardOptions} />
            
            <Stack.Screen name="wallet-receive" component={WalletReceiveScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send" component={SendScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-receiver" component={SendReceiverScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-send-final" component={SendFinalScreen} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-settings" component={WalletSettings} options={ScreenCardOptions} />
            <Stack.Screen name="wallet-transaction" component={TransactionScreen} options={ScreenCardOptions} />

            <Stack.Screen name="add-follow" component={AddFolowScreen} options={ScreenCardOptions} />
            <Stack.Screen name="friends-list" component={ManageFriendsScreen} options={ScreenCardOptions} />

            <Stack.Screen name="feed-order-new" component={NewOrderScreen} options={ScreenCardOptions} />
            <Stack.Screen name="feed-order-ndetails" component={OrderClosureScreen} options={ScreenCardOptions} />
        </Stack.Navigator>
    )
}

export default AppStack
