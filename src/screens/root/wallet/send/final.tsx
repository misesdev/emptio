import { View, Text, StyleSheet } from "react-native"
import { ButtonDefault, ButtonPrimary } from "@components/form/Buttons"
import SplashScreen from "@components/general/SplashScreen"
import { formatSats, toNumber } from "@services/converter"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { User, Wallet } from "@services/memory/types"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { walletService } from "@services/wallet"
import { BNetwork } from "bitcoin-tx-lib"
import { ProfilePicture } from "@/src/components/nostr/user/ProfilePicture"
import { getUserName } from "@/src/utils"

const SendFinalScreen = ({ navigation, route }: any) => {

    const { wallet, amount, address, user } = route.params
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(true)
    console.log("amount", amount)
    const handleSend = async () => {

        setLoading(true)

        const result = await walletService.transaction.get({ 
            amount: toNumber(amount), 
            destination: address, 
            walletKey: wallet.key ?? ""
        })

        if (result.success) {
            const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"
            await walletService.transaction.send(result.data, network)
        }

        if (!result.success && result.message) {
            setLoading(false)
            return pushMessage(result.message)
        }

        setLoading(false)
    }

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.black
        }}>
            <HeaderScreen
                title={"Escolha a taxa de rede"}
                onClose={() => navigation.goBack()}
            />  

            <View style={{ flexDirection: "column", alignItems: "center", marginVertical: 10 }}>
                <ProfilePicture size={100} withBorder user={user} />
                <View>
                    <Text style={styles.title}>{getUserName(user)}</Text>
                </View>
            </View>

            <Text style={[styles.title, { fontSize: 14, fontWeight: "400" }]}>
                {amount} to {address} of {getUserName(user)}
            </Text>

            <Text style={styles.title}>
                Qual a taxa de rede deseja pagar? 
            </Text>

            

            <View style={styles.buttonArea}>
                <ButtonPrimary 
                    disabled={nextDisabled}
                    label={useTranslate("commons.send")}
                    onPress={handleSend}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 24, maxWidth: "80%", fontWeight: "bold", textAlign: "center", marginVertical: 10, color: theme.colors.white },
    buttonArea: { width: "100%", justifyContent: "center", alignItems: "center" }
})

export default SendFinalScreen
