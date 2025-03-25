import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { useEffect, useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { Wallet } from "@services/memory/types"
import theme from "@src/theme"

type ScreenParams = {
    wallet: Wallet
}

const SendScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { wallet } = route.params as ScreenParams
    const { useTranslate } = useTranslateService()
    const [amount, setAmount] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)

    return (
        <View style={styles.container}>
            <HeaderScreen style={{ marginBottom: 25 }} 
                title={useTranslate("wallet.title.send")} 
                onClose={() => navigation.goBack()}
            />

            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox
                value={amount} 
                wallet={wallet} 
                onChangeText={setAmount} 
                isValidHandle={(valid) => setNextDisabled(!valid)} 
            />

            <View style={styles.buttonArea}>
                <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate("wallet-send-receiver-stack", { amount, wallet })} disabled={nextDisabled}
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
    title: { fontSize: 25, maxWidth: "90%", fontWeight: "bold", textAlign: "center", 
        color: theme.colors.white },
    buttonArea: { position: "absolute", bottom: 30, padding: 10, width: "100%", 
        flexDirection: "row-reverse" }
})

export default SendScreen
