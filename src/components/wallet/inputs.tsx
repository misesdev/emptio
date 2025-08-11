import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SelectWalletBox, { showSelectWallet } from "./WalletSelection"
import { Wallet } from "@services/wallet/types/Wallet"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { Formatter } from "@services/converter/Formatter"
import { Utilities } from "@src/utils/Utilities"
import theme from "@src/theme"
import { StoredItem } from "@storage/types"

interface AmountBoxProps {
    value?: string | "",
    wallet: StoredItem<Wallet>,
    setWallet?: (wallet: StoredItem<Wallet>) => void,
    placeholder?: string,
    manageWallet?: boolean,
    onChangeText: (text: string) => void,
    isValidHandle?: (valid: boolean) => void
}

export const AmountBox = ({ value, placeholder, onChangeText, isValidHandle, wallet, setWallet, manageWallet = false }: AmountBoxProps) => {

    const { useTranslate } = useTranslateService()

    const hadleValidateFormat = (text: string) => {

        const textNumbers = Formatter.textToNumber(text)

        onChangeText(Formatter.formatSats(textNumbers))

        if (isValidHandle) 
        {
            if (wallet.entity.lastBalance)
                isValidHandle(textNumbers > 0 && wallet.entity.lastBalance >= textNumbers)
            else
                isValidHandle(false)
        }
    }

    const walletSelection = (item: StoredItem<Wallet>) => {
        if(setWallet) setWallet(item)

        const textNumbers = Formatter.textToNumber(value ?? "0")

        if(isValidHandle)
            isValidHandle(textNumbers >= (wallet?.entity.lastBalance ?? 0))
    }

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="logo-bitcoin" 
                        color={wallet.entity.network == "testnet" ? theme.colors.green : theme.colors.orange}
                        size={40} 
                    /> 
                </View>
                <View style={{ width: "85%" }}>
                    <TextInput
                        value={value}
                        keyboardType="numeric"
                        style={styles.amount}
                        placeholder={placeholder}
                        onChangeText={hadleValidateFormat}
                        cursorColor={theme.colors.gray}
                        multiline={false}
                        autoFocus
                    />
                </View>
            </View>
            <Text style={styles.balance}>
                {`${useTranslate("wallet.subtitle.balance")}${Formatter.formatSats(wallet.entity.lastBalance??0)} sats.`}
            </Text>
            
            {manageWallet &&
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <TouchableOpacity style={styles.wallets} onPress={showSelectWallet}>
                        <Ionicons style={{ marginHorizontal: 8 }} size={20} name="wallet" color={theme.colors.white} />
                        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.colors.white }}>
                            {Utilities.getClipedContent(wallet.entity.name??"", 15)}
                        </Text>
                        <Ionicons style={{ marginHorizontal: 4 }} size={20} name="chevron-forward" color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            }

            <SelectWalletBox wallet={wallet} setWallet={walletSelection} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: "90%", paddingHorizontal: 20, paddingVertical: 15, 
        borderRadius: theme.design.borderRadius, margin: 10, 
        backgroundColor: "rgba(0, 55, 55, .2)" },
    amount: { padding: 10, fontSize: 32, fontWeight: "bold", borderBottomWidth: 1, 
        borderBottomColor: theme.colors.gray, color: theme.colors.white },
    wallets: { borderRadius: 10, padding: 2, backgroundColor: theme.colors.blueOpacity, 
        flexDirection: "row" }, 
    balance: { fontSize: 14, marginVertical: 10, color: theme.colors.gray }
})
