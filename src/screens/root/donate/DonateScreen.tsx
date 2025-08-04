import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { AmountBox } from "@components/wallet/inputs"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackScreenProps } from "@react-navigation/stack"
import { useDonateState } from "./hooks/useDonateState"
import theme from "@src/theme"

const DonateScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const { wallets, wallet, setWallet, 
        disabled, setDisabled, amount, setAmount, sendMoney
    } = useDonateState({ navigation, route }) 

    return (
        <View style={{ flex: 1, alignItems: "center" }} >
            <HeaderScreen
                style={{ marginBottom: 25 }}
                title={useTranslate("screen.title.donate")} 
                onClose={() => navigation.goBack()} 
            />
            
            <Text style={styles.title}>{useTranslate("wallet.title.sendvalue")}</Text>

            <AmountBox wallet={wallet} setWallet={setWallet} manageWallet={wallets.length > 1} value={amount} onChangeText={setAmount} isValidHandle={(valid) => setDisabled(!valid)} />

            <View style={styles.buttonArea}>
                <TouchableOpacity activeOpacity={.7} disabled={disabled}
                    onPress={sendMoney}
                    style={{ borderRadius: 50, padding: 14, margin: 10, backgroundColor: disabled ? theme.colors.disabled : theme.colors.blue }}
                >
                    <Ionicons name="arrow-forward-outline" size={theme.icons.large} color={disabled ? theme.colors.gray : theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 25, width: "90%", marginHorizontal: "5%", fontWeight: "bold",
        textAlign: "center", color: theme.colors.white },
    buttonArea: { position: "absolute", bottom: 30, padding: 10, width: "100%", 
        flexDirection: "row-reverse" }
})

export default DonateScreen
