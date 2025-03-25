import { View, Text, StyleSheet } from "react-native"
import { ButtonDefault } from "@components/form/Buttons"
import SplashScreen from "@components/general/SplashScreen"
import { toNumber } from "@services/converter"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { Wallet } from "@services/memory/types"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { walletService } from "@services/wallet"
import { BNetwork } from "bitcoin-tx-lib"

const SendFinalScreen = ({ navigation, route }: any) => {

    const wallet = route.params.wallet as Wallet
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(true)
    const [amount, setAmount] = useState<string>("")
    const [address, setAddress] = useState<string>("")

    useEffect(() => {        
        setAmount(route.params?.amount)
        setAddress(route.params?.address)
        console.log(route.params?.address)
        setLoading(false)
    }, [])

    const handleSend = async () => {

        setLoading(true)

        const result = await walletService.transaction.get({ amount: toNumber(amount), destination: address, walletKey: wallet.key ?? "" })

        if (result.success) {
            const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"
            await walletService.transaction.send(result.data, network)
        }

        if (!result.success && result.message) {
            setLoading(false)
            return pushMessage(result.message)
        }

        console.log("sign transaction: ", result.data)

        setLoading(false)
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.black
        }}>
            {/* Header */}
            <HeaderScreen
                title={useTranslate("wallet.title.sendfor")}
                onClose={() => navigation.navigate("wallet-send-stack")}
            />

            {/* Body */}
            <Text style={[styles.title, { display: searching ? "none" : "flex" }]}>{`${useTranslate("wallet.title.sendreceiver")}${route.params?.amount} sats?`}</Text>

            {/* Footer */}
            <View style={{ position: "absolute", bottom: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <ButtonDefault label={useTranslate("commons.send")} rightIcon="exit" onPress={handleSend} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 24, maxWidth: "90%", fontWeight: "bold", textAlign: "center", marginVertical: 10, color: theme.colors.white }
})

export default SendFinalScreen
