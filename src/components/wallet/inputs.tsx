import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import { formatSats, toNumber } from "@services/converter"
import Ionicons from "react-native-vector-icons/Ionicons"
import SelectWalletBox, { showSelectWallet } from "./WalletSelection"
import { useTranslateService } from "@src/providers/translateProvider"
import { Wallet } from "@services/memory/types"
import theme from "@src/theme"
import { getClipedContent } from "@/src/utils"

interface AmountBoxProps {
    value?: string | "",
    wallet: Wallet,
    setWallet?: (wallet: Wallet) => void,
    placeholder?: string,
    manageWallet?: boolean,
    onChangeText: (text: string) => void,
    isValidHandle?: (valid: boolean) => void
}

export const AmountBox = ({ value, placeholder, onChangeText, isValidHandle, wallet, setWallet, manageWallet = false }: AmountBoxProps) => {

    const { useTranslate } = useTranslateService()

    const hadleValidateFormat = (text: string) => {

        const textNumbers = toNumber(text)

        onChangeText(formatSats(textNumbers))

        if (isValidHandle) 
        {
            if (wallet?.lastBalance)
                isValidHandle(textNumbers > 0 && wallet?.lastBalance >= textNumbers)
            else
                isValidHandle(false)
        }
    }

    const walletSelection = (item: Wallet) => {
        if(setWallet) setWallet(item)

        const textNumbers = toNumber(value ?? "0")

        if(isValidHandle)
            isValidHandle(textNumbers >= (wallet?.lastBalance ?? 0))
    }

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="logo-bitcoin" 
                        color={wallet.network == "testnet" ? theme.colors.green : theme.colors.orange}
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
                {`${useTranslate("wallet.subtitle.balance")}${formatSats(wallet.lastBalance)} sats.`}
            </Text>
            
            {manageWallet &&
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <TouchableOpacity style={styles.wallets} onPress={showSelectWallet}>
                        <Ionicons style={{ marginHorizontal: 8 }} size={20} name="wallet" color={theme.colors.white} />
                        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.colors.white }}>
                            {getClipedContent(wallet.name??"", 15)}
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
    container: { width: "90%", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10, 
        margin: 10, backgroundColor: theme.input.backGround },
    amount: { padding: 10, fontSize: 32, fontWeight: "bold", borderBottomWidth: 1, 
        borderBottomColor: theme.colors.gray, color: theme.colors.white },
    wallets: { borderRadius: 10, padding: 2, backgroundColor: theme.colors.blueOpacity, 
        flexDirection: "row" }, 
    balance: { fontSize: 14, marginVertical: 10, color: theme.colors.gray }
})
