import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { Wallet } from "@services/memory/types"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { useAuth } from "@src/providers/userProvider"
import { CurrencyInput } from "@components/wallet/currency/CurrencyInput"

const NewOrderScreen = ({ navigation }: StackScreenProps<any>) => {

    const { wallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [price, setPrice] = useState<string>("0")
    const [satoshis, setSatoshis] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)
    const [wallet, setWallet] = useState<Wallet>({})

    useEffect(() => { 
        setWallet(wallets.find(w => w.default) ?? {})
    }, [])

    return (
        <View style={styles.container}>
            <HeaderScreen style={{ marginBottom: 25 }}
                title={useTranslate("order.new.title")} 
                onClose={() => navigation.goBack()} 
            />

            <Text style={styles.title}>
                {useTranslate("order.new.amount-title")}
            </Text>

            <AmountBox wallet={wallet} 
                setWallet={setWallet}
                manageWallet={wallets.length > 1} 
                value={satoshis} 
                onChangeText={setSatoshis} 
                isValidHandle={(valid) => setNextDisabled(!valid)}
            />

            <CurrencyInput 
                value={price} 
                onChange={setPrice}
                label={"Defina o preço dos satoshis em fiat."}
            />

            <View style={styles.buttonArea}>
                <TouchableOpacity activeOpacity={.7} disabled={nextDisabled}
                    onPress={() => navigation.navigate("feed-order-ndetails", { wallet, satoshis })}
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
