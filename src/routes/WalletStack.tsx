import { TypedNavigator } from "@react-navigation/native";
import WalletScreen from "@screens/root/wallet/WalletScreen";
import NewWalletScreen from "@screens/root/wallet/new/NewWalletScreen";
import WalletNameScreen from "@screens/root/wallet/new/WalletNameScreen"
import NetworkScreen from "@screens/root/wallet/new/NetworkScreen"
import MnemonicScreen from "@screens/root/wallet/new/MnemonicScreen"
import PassphraseScreen from "@screens/root/wallet/new/PassphraseScreen"
import TransactionScreen from "@screens/root/wallet/transaction/TransactionScreen";
import WalletSettings from "@screens/root/wallet/settings/WalletSettings";
import SendFinalScreen from "@screens/root/wallet/send/SendFinalScreen";
import ReceiverScreen from "@screens/root/wallet/send/ReceiverScreen";
import SendScreen from "@screens/root/wallet/send/SendScreen";
import { CardStyleInterpolators } from "@react-navigation/stack";
import WalletReceiveScreen from "@screens/root/wallet/receive/WalletReceiveScreen";
import MnemonicConfirmationScreen from "@screens/root/wallet/new/MnemonicConfirmationScreen";
import ImportationScreen from "@screens/root/wallet/new/ImportationScreen";

type Props = {
    Stack: TypedNavigator<any>
}

const WalletStackNavigation = ({ Stack }: Props) => {
    const ScreenCardOptions = { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }
    return (
        <>
            <Stack.Screen 
                name="wallet" 
                component={WalletScreen} 
                options={{ headerShown: true }} 
            />
            <Stack.Screen 
                name="new-wallet"
                component={NewWalletScreen} 
                options={ScreenCardOptions}
            />
            <Stack.Screen 
                name="import-wallet" 
                component={ImportationScreen} 
                options={ScreenCardOptions} 
            />
            <Stack.Screen 
                name="create-wallet" 
                component={WalletNameScreen}
                options={ScreenCardOptions} 
            />
            <Stack.Screen 
                name="wallet-network"
                component={NetworkScreen} 
                options={ScreenCardOptions} 
            />
            <Stack.Screen 
                name="wallet-mnemonic"
                component={MnemonicScreen}
                options={{...ScreenCardOptions, headerShown: true }} 
            />
            <Stack.Screen 
                component={MnemonicConfirmationScreen}
                name="wallet-mnemonic-confirmation" 
                options={{...ScreenCardOptions, headerShown: true }} 
            />
            <Stack.Screen
                name="wallet-passphrase" 
                component={PassphraseScreen} 
                options={{...ScreenCardOptions, headerShown: true }} 
            />
            <Stack.Screen 
                name="wallet-receive" 
                component={WalletReceiveScreen}
                options={ScreenCardOptions} 
            />
            <Stack.Screen 
                name="wallet-send"
                component={SendScreen} 
                options={ScreenCardOptions}
            />
            <Stack.Screen
                name="wallet-send-receiver"
                component={ReceiverScreen}
                options={ScreenCardOptions}
            />
            <Stack.Screen 
                name="wallet-send-final"
                component={SendFinalScreen} 
                options={ScreenCardOptions}
            />
            <Stack.Screen
                name="wallet-settings"
                component={WalletSettings}
                options={ScreenCardOptions}
            />
            <Stack.Screen
                name="wallet-transaction" 
                component={TransactionScreen} 
                options={ScreenCardOptions} 
            />
        </>
    )
}

export default WalletStackNavigation
