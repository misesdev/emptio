import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import { formatSats, toNumber } from "@services/converter"
import Ionicons from "react-native-vector-icons/Ionicons"
import SelectWalletBox, { showSelectWallet } from "./WalletSelection"
import { useTranslateService } from "@src/providers/translateProvider"
import { Wallet } from "@services/memory/types"
import theme from "@src/theme"
import { getClipedContent } from "@/src/utils"

type AmountBoxProps = {
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
            <TextInput
                value={value}
                keyboardType="numeric"
                style={styles.amount}
                placeholder={placeholder}
                onChangeText={hadleValidateFormat}
                cursorColor={theme.colors.gray}
                textAlign="center"
                autoFocus
            />
            <Text style={styles.balance}>
                {`${useTranslate("wallet.subtitle.balance")}${formatSats(wallet.lastBalance)} sats.`}
            </Text>
            
            {manageWallet &&
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <TouchableOpacity style={styles.wallets} onPress={showSelectWallet}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.colors.white }}>
                            {getClipedContent(wallet.name??"", 15)}
                        </Text>
                        <Ionicons style={{ marginHorizontal: 2 }} size={20} name="chevron-forward" color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            }

            <SelectWalletBox wallet={wallet} setWallet={walletSelection} />
        </View>

    )
}

const styles = StyleSheet.create({
    container: { width: "90%", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 24, 
        margin: 10 },
    amount: { padding: 10, fontSize: 32, fontWeight: "bold", borderBottomWidth: 1, 
        borderBottomColor: theme.colors.gray, color: theme.colors.white },
    wallets: { borderRadius: 10, backgroundColor: theme.colors.transparent, 
        flexDirection: "row" }, 
    balance: { fontSize: 14, marginVertical: 10, color: theme.colors.gray }
})
