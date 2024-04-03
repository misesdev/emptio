import { View, Text, StyleSheet } from "react-native"
import { HeaderPageSend } from "./components"
import { useTranslate } from "@src/services/translate"
import { ButtonScanQRCode } from "@components/wallet/buttons"
import { TextBox } from "@components/form/TextBoxs"
import { useAuth } from "@src/providers/userProvider"
import { ButtonSuccess } from "@components/form/Buttons"
import { ValidateAddress, sendTransaction } from "@src/services/bitcoin"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import SplashScreen from "@components/general/SplashScreen"
import { toNumber } from "@src/services/converter"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { SectionHeader } from "@/src/components/general/section/headers"
import { FriendList } from "@/src/components/nostr"

const SendReceiverScreen = ({ navigation, route }: any) => {

    const { wallet } = useAuth()

    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [whoaddres, setWhoaddress] = useState<string>("")

    useEffect(() => {
        setAmount(route.params?.amount)
        setLoading(false)
    }, [])

    const handleRead = (value: string) => {
        setAddress(value)
        setWhoaddress(value)
    }

    const handleSend = async () => {
        if (!ValidateAddress(address))
            return alertMessage(`invalid bitcoin address: ${address}.`)

        setLoading(true)
        const txid = await sendTransaction({ amount: toNumber(amount), destination: address, walletKey: wallet.key ?? "" })

        setLoading(false)
        console.log("txid of transaction: ", txid)
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
            <HeaderPageSend
                title={useTranslate("wallet.title.sendfor")}
                onClose={() => navigation.navigate("wallet-send-stack")}
            />

            {/* Body */}
            <Text style={styles.title}>{`${useTranslate("wallet.title.sendreceiver")}${route.params?.amount} sats?`}</Text>

            <TextBox value={whoaddres} placeholder={useTranslate("wallet.placeholder.addressuser")} onChangeText={setWhoaddress} />

            <ButtonScanQRCode label={useTranslate("commons.scan")} onChangeText={handleRead} />

            <SectionHeader label={useTranslate("labels.friends")} icon="people" />

            <FriendList searchTerm={whoaddres} onPressFollow={user => { console.log(user) }} />

            {/* Footer */}
            <View style={{ position: "absolute", bottom: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <ButtonSuccess label={useTranslate("commons.send")} leftIcon="exit" onPress={handleSend} />
            </View>

            <AlertBox />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        maxWidth: "90%",
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
        color: theme.colors.white
    }
})

export default SendReceiverScreen