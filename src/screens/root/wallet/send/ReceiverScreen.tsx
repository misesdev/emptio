import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FollowList } from "@components/nostr/follow/FollowList"
import { ButtonScanQRCode } from "@components/wallet/buttons"
import { TextBox } from "@components/form/TextBoxs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SectionHeader } from "@components/general/section/headers"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { pushMessage } from "@services/notification"
import { Address } from "bitcoin-tx-lib"
import { useState } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { User } from "@/src/services/user/types/User"
import { Utilities } from "@/src/utils/Utilities"

const ReceiverScreen = ({ navigation, route }: any) => {

    const { wallet, amount } = route.params
    const { useTranslate } = useTranslateService()
    const [nextDisabled, setNextDisabled] = useState(true)
    const [address, setAddress] = useState<string>("")

    const handleSend = (value: string) => {
        setAddress(value)
        setNextDisabled(!Address.isValid(value))
        if(Address.isValid(value)) { 
            navigation.navigate("wallet-send-final-stack", { 
                amount, 
                address: value,
                wallet 
            })
        }
    }

    const onChangeText = (value: string) => {
        setNextDisabled(!Address.isValid(value))
        setAddress(value)
    }

    const handleSelectUser = (user: User) => {
        if(!Address.isValid(user.bitcoin_address??"")) 
            return pushMessage(`${Utilities.getUserName(user)} ${useTranslate("wallet.address.not-contains")}`)
       
        navigation.navigate("wallet-send-final", {
            address: user.bitcoin_address, 
            amount, wallet, receiver: user 
        })
    }

    return (
        <View style={styles.container}>
            <HeaderScreen
                title={useTranslate("wallet.title.sendfor")}
                onClose={() => navigation.goBack()}
            />

            <Text style={styles.title}>
                {`${useTranslate("wallet.title.sendreceiver")}${route.params?.amount} sats?`}
            </Text>

            <TextBox value={address}
                onChangeText={onChangeText}
                placeholder={useTranslate("wallet.placeholder.addressuser")}
            />

            <ButtonScanQRCode label={useTranslate("commons.scan")} onChangeText={handleSend} />

            <SectionHeader label={useTranslate("labels.friends")} icon="people" />

            <FollowList searchable labelAction={useTranslate("commons.send")} onPressFollow={handleSelectUser} />

            <View style={styles.buttonArea}>
                <TouchableOpacity activeOpacity={.7} onPress={() => handleSend(address)} disabled={nextDisabled}
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
        marginVertical: 10, color: theme.colors.white },
    buttonArea: { position: "absolute", bottom: 30, padding: 10, width: "100%", flexDirection: "row-reverse" }
})

export default ReceiverScreen
