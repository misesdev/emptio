import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { HeaderScreen } from "@components/general/HeaderPage"
import { useTranslate } from "@src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { getWallet } from "@src/services/memory/wallets"
import theme from "@src/theme"
import { useEffect, useState } from "react"
import { AmountBox } from "@components/wallet/inputs"
import { Ionicons } from "@expo/vector-icons"

const DonateScreen = ({ navigation }: any) => {

    const { user, setWallet } = useAuth()
    const [amount, setAmount] = useState<string>()
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        handleLoadData()
    }, [])

    const handleLoadData = async () => {
        const wallet = await getWallet(user.default_wallet ?? "")

        if (setWallet)
            setWallet(wallet)
    }

    const handleSendMoney = () => {

    }

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.black
        }} >
            <HeaderScreen title={useTranslate("screen.title.donate")} onClose={() => navigation.navigate("core-stack")} />

            {/* Body */}
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox value={amount} onChangeText={setAmount} isValidHandle={(valid) => setDisabled(!valid)} />

            {/* Footer */}
            <View style={styles.sectionBottom}>
                <TouchableOpacity activeOpacity={.7} onPress={handleSendMoney} disabled={disabled}
                    style={[styles.sendButton, { backgroundColor: disabled ? theme.colors.disabled : theme.colors.blue }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.sendButtonText, { color: disabled ? theme.colors.gray : theme.colors.white }]}>{useTranslate("commons.send")}</Text>
                        <Ionicons name="exit"
                            size={theme.icons.medium}
                            color={disabled ? theme.colors.gray : theme.colors.white}
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 30, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    sectionBottom: { position: "absolute", bottom: 0, padding: 10, width: "100%", alignItems: "center" },
    sendButtonText: { fontSize: 13, fontWeight: "500", textAlign: 'center', marginHorizontal: 10, },
    sendButton: { borderRadius: 25, paddingVertical: 14, margin: 10, minWidth: 160 }
})

export default DonateScreen