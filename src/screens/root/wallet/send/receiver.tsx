import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FollowList } from "@components/nostr/follow/FollowList"
import { ButtonScanQRCode } from "@components/wallet/buttons"
import { TextBox } from "@components/form/TextBoxs"
import SplashScreen from "@components/general/SplashScreen"
import { walletService } from "@src/core/walletManager"
import Ionicons from "@react-native-vector-icons/ionicons"
import { useEffect, useState } from "react"
import { SectionHeader } from "@components/general/section/headers"
import { HeaderScreen } from "@components/general/HeaderScreen"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"

const SendReceiverScreen = ({ navigation, route }: any) => {

    const { wallet } = route.params
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    // const [searching, setSearching] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(true)
    const [amount, setAmount] = useState<string>("")
    const [address, setAddress] = useState<string>("")

    useEffect(() => {
        setAmount(route.params?.amount)
        setLoading(false)
    }, [])

    const handleRead = (value: string) => {
        setAddress(value)
        setNextDisabled(!walletService.address.validate(value))
    }

    const onChangeText = (value: string) => {
        setAddress(value)
        setNextDisabled(!walletService.address.validate(value))
    }

    const handleSendToFee = async () => navigation.navigate("wallet-send-final-stack", { amount, address, wallet })

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
                onClose={() => navigation.navigate("wallet-send-stack", { wallet })}
            />

            {/* Body */}
            {/* <Hidable visible={!searching}> */}
            <Text style={styles.title}>{`${useTranslate("wallet.title.sendreceiver")}${route.params?.amount} sats?`}</Text>
            {/* </Hidable> */}

            <TextBox value={address}
                onChangeText={onChangeText}
                // onFocus={() => setSearching(true)}
                // onBlur={() => setSearching(false)}
                placeholder={useTranslate("wallet.placeholder.addressuser")}
            />

            {/* <Hidable visible={!searching}> */}
            <ButtonScanQRCode label={useTranslate("commons.scan")} onChangeText={handleRead} />
            {/* </Hidable> */}

            <SectionHeader label={useTranslate("labels.friends")} icon="people" />

            <FollowList searchable searchTerm={address} onPressFollow={user => { console.log(user) }} />

            <View style={{ position: "absolute", bottom: 30, padding: 10, width: "100%", flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={handleSendToFee} disabled={nextDisabled}
                    style={{ borderRadius: 50, padding: 14, margin: 10, backgroundColor: nextDisabled ? theme.colors.disabled : theme.colors.blue }}
                >
                    <Ionicons name="arrow-forward-outline" size={theme.icons.large} color={nextDisabled ? theme.colors.gray : theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 24, maxWidth: "90%", fontWeight: "bold", textAlign: "center", marginVertical: 10, color: theme.colors.white }
})

export default SendReceiverScreen
