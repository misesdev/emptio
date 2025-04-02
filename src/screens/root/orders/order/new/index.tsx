import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { Wallet } from "@services/memory/types"
import { useEffect, useState } from "react"
import theme from "@src/theme"

const NewOrderScreen = ({ navigation }: StackScreenProps<any>) => {

    const { wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [amount, setAmount] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)
    const [wallet, setWallet] = useState<Wallet>({})

    useEffect(() => { loadWallet() }, [])

    const loadWallet = async () => {
        let wallet = wallets.find(w => w.default)
        if(wallet) setWallet(wallet)
    } 

    return (
        <View style={styles.container}>
            <HeaderScreen style={{ marginBottom: 25 }}
                title={useTranslate("order.new.title")} 
                onClose={() => navigation.goBack()} 
            />

            <Text style={styles.title}>{useTranslate("order.new.amount-title")}</Text>

            <AmountBox wallet={wallet} 
                setWallet={setWallet}
                manageWallet={wallets.length > 1} 
                value={amount} 
                onChangeText={setAmount} 
                isValidHandle={(valid) => setNextDisabled(!valid)}
            />

            {/* Footer */}
            <View style={styles.buttonArea}>
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
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.colors.black },
    title: { fontSize: 25, maxWidth: "90%", fontWeight: "bold", textAlign: "center",
        color: theme.colors.white },
    buttonArea: { position: "absolute", bottom: 30, padding: 10, width: "100%", 
        flexDirection: "row-reverse" }
})

export default NewOrderScreen
