import { useTranslate } from "@src/services/translate"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AmountBox } from "@components/wallet/inputs"
import { HeaderPageWallet } from "../components"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import theme from "@src/theme"

const SendScreen = ({ navigation }: any) => {

    const [amount, setAmount] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.black
        }}>
            {/* Hader */}
            <HeaderPageWallet title={useTranslate("wallet.title.send")} onClose={() => navigation.navigate("wallet-stack")} />

            {/* Body */}
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox value={amount} onChangeText={setAmount} isValidHandle={(valid) => setNextDisabled(!valid)} />

            {/* Footer */}
            <View style={{ position: "absolute", bottom: 0, padding: 10, width: "100%", flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate("wallet-send-receiver-stack", { amount })} disabled={nextDisabled}
                    style={{ borderRadius: 50, padding: 14, margin: 10, backgroundColor: nextDisabled ? theme.colors.disabled : theme.colors.blue }}
                >
                    <Ionicons name="arrow-forward-outline" size={theme.icons.large} color={nextDisabled ? theme.colors.gray : theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        maxWidth: "90%",
        fontWeight: "bold",
        textAlign: "center",
        color: theme.colors.white
    },
})

export default SendScreen