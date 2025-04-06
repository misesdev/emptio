import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useAuth } from "@src/providers/userProvider"
import { useEffect, useState } from "react"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { User, Wallet } from "@services/memory/types"
import { StackScreenProps } from "@react-navigation/stack"
import { userService } from "@services/user"
import theme from "@src/theme"

const DonateScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [amount, setAmount] = useState<string>("0")
    const [disabled, setDisabled] = useState(true)
    const [receiver, setReceiver] = useState<User>({})
    const [wallet, setWallet] = useState<Wallet>(route?.params?.wallet as Wallet)

    useEffect(() => {
        let pubkey: string = process.env.EMPTIO_PUBKEY ?? ""
        userService.getProfile(pubkey.trim()).then(receiver => {
            setReceiver(receiver)
        }).catch(console.log)
    }, [])

    const handleSendMoney = () => {
        const address = wallet.network == "testnet" ? process.env.EMPTIO_TESTNET_ADDRESS
            : process.env.EMPTIO_MAINNET_ADDRESS

        console.log("emptio bitcoin address", address)

        navigation.navigate("wallet-send-final-stack", { 
            origin: "donation",
            receiver,
            wallet,
            amount,
            address
        })
    }

    return (
        <View style={{ flex: 1 }} >
            <HeaderScreen
                style={{ marginBottom: 25 }}
                title={useTranslate("screen.title.donate")} 
                onClose={() => navigation.goBack()} 
            />
            
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox wallet={wallet} setWallet={setWallet} manageWallet={wallets.length > 1} value={amount} onChangeText={setAmount} isValidHandle={(valid) => setDisabled(!valid)} />

            <View style={styles.buttonArea}>
                <TouchableOpacity activeOpacity={.7} disabled={disabled}
                    onPress={handleSendMoney}
                    style={{ borderRadius: 50, padding: 14, margin: 10, backgroundColor: disabled ? theme.colors.disabled : theme.colors.blue }}
                >
                    <Ionicons name="arrow-forward-outline" size={theme.icons.large} color={disabled ? theme.colors.gray : theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 25, width: "90%", marginHorizontal: "5%", fontWeight: "bold",
        textAlign: "center", color: theme.colors.white },
    buttonArea: { position: "absolute", bottom: 30, padding: 10, width: "100%", 
        flexDirection: "row-reverse" }
})

export default DonateScreen
