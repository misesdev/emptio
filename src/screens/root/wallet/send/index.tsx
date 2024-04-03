import { useTranslate } from "@src/services/translate"
import theme from "@src/theme"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useAuth } from "@/src/providers/userProvider"
import { formatSats } from "@/src/services/converter"
import { AmountBox } from "@components/wallet/inputs"

const SendSatsScreen = ({ navigation }: any) => {

    const { wallet } = useAuth()
    const [amount, setAmount] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)

    const handleDigit = () => {

    }

    return (
        <View style={theme.styles.container}>
            {/* Hader */}
            <View style={{ flexDirection: "row", position: "absolute", top: 0, width: "100%" }}>
                <View style={{ width: "75%", padding: 6 }}>
                    <Text style={{ color: theme.colors.white, fontSize: 20, fontWeight: "bold", margin: 15 }}>
                        {useTranslate("wallet.title.send")}
                    </Text>
                </View>
                <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                    <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate("wallet-stack")}
                        style={{ borderRadius: 20, padding: 6, backgroundColor: theme.colors.gray, margin: 15 }}
                    >
                        <Ionicons name="close" size={theme.icons.medium} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Body */}
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox value={amount} onChangeText={setAmount} isValidHandle={(valid) => setNextDisabled(!valid)} />

            {/* Footer */}
            <View style={{ position: "absolute", bottom: 0, padding: 10, width: "100%", flexDirection: "row-reverse" }}>
                <TouchableOpacity activeOpacity={.7} onPress={() => { }} disabled={nextDisabled}
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

export default SendSatsScreen