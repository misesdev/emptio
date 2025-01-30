import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useAuth } from "@src/providers/userProvider"
import { useEffect, useState } from "react"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { Wallet } from "@services/memory/types"
import { StackScreenProps } from "@react-navigation/stack"
import theme from "@src/theme"

const DonateScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { wallets } = useAuth()
    const [amount, setAmount] = useState<string>()
    const [disabled, setDisabled] = useState(true)
    const { useTranslate } = useTranslateService()
    const [wallet, setWallet] = useState<Wallet>(route?.params?.wallet as Wallet)

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => <HeaderScreen title={useTranslate("screen.title.donate")} onClose={() => navigation.navigate("core-stack")} />
        })
        // handleLoadData()
    }, [])

    const selecteWallet = (wallet: Wallet) => {
        setWallet(wallet)
        
    }

    const handleSendMoney = () => {

    }

    return (
        <View style={theme.styles.container} >
            {/* Body */}
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox wallet={wallet} setWallet={setWallet} manageWallet={wallets.length > 1} value={amount} onChangeText={setAmount} isValidHandle={(valid) => setDisabled(!valid)} />

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
    title: { fontSize: 25, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    sectionBottom: { position: "absolute", bottom: 30, padding: 10, width: "100%", alignItems: "center" },
    sendButtonText: { fontSize: 13, fontWeight: "500", textAlign: 'center', marginHorizontal: 10, },
    sendButton: { borderRadius: 18, paddingVertical: 14, margin: 10, minWidth: 160 }
})

export default DonateScreen
