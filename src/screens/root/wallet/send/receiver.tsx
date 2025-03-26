import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FollowList } from "@components/nostr/follow/FollowList"
import { ButtonScanQRCode } from "@components/wallet/buttons"
import { TextBox } from "@components/form/TextBoxs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SectionHeader } from "@components/general/section/headers"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/translateProvider"
import { User } from "@services/memory/types"
import { pushMessage } from "@services/notification"
import { getUserName } from "@src/utils"
import { Address } from "bitcoin-tx-lib"
import { useState } from "react"
import theme from "@src/theme"

const SendReceiverScreen = ({ navigation, route }: any) => {

    const { wallet, amount } = route.params
    const { useTranslate } = useTranslateService()
    const [nextDisabled, setNextDisabled] = useState(true)
    const [address, setAddress] = useState<string>("")

    const handleRead = (value: string) => {
        setNextDisabled(!Address.isValid(value))
        setAddress(value)
    }

    const onChangeText = (value: string) => {
        setNextDisabled(!Address.isValid(value))
        setAddress(value)
    }

    const handleSelectUser = (user: User) => {
        if(!Address.isValid(user.bitcoin_address??"")) 
            return pushMessage(`${getUserName(user)} não possui carteira no app.`)
       
        navigation.navigate("wallet-send-final-stack", {
            address: user.bitcoin_address, 
            amount, wallet, user 
        })
    }

    const handleSendToFee = () => { 
        navigation.navigate("wallet-send-final-stack", { amount, address, wallet })
    }

    return (
        <View style={styles.container}>
            <HeaderScreen
                title={useTranslate("wallet.title.sendfor")}
                onClose={() => navigation.goBack()}
            />

            <Text style={styles.title}>{`${useTranslate("wallet.title.sendreceiver")}${route.params?.amount} sats?`}</Text>

            <TextBox value={address}
                onChangeText={onChangeText}
                placeholder={useTranslate("wallet.placeholder.addressuser")}
            />

            <ButtonScanQRCode label={useTranslate("commons.scan")} onChangeText={handleRead} />

            <SectionHeader label={useTranslate("labels.friends")} icon="people" />

            <FollowList searchable toPayment onPressFollow={handleSelectUser} />

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
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.colors.black },
    title: { fontSize: 24, maxWidth: "90%", fontWeight: "bold", textAlign: "center", 
        marginVertical: 10, color: theme.colors.white }
})

export default SendReceiverScreen
