import theme from "@src/theme"
import { StyleSheet, ScrollView, View, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { useState } from "react"
import { Order } from "@services/nostr/orders"
import { toNumber } from "@services/converter"
import { timeSeconds } from "@services/converter"

const OrderDetailScreen = ({ navigation, route }: any) => {

    const { user } = useAuth() 
    const { amount } = route.params
    const { useTranslate } = useTranslateService()
    const [price, setPrice] = useState<string>("0")
    const [currency, setCurrency] = useState<string>("USD")
    const [closure, setClosure] = useState<number>(timeSeconds.now())
    const [loading, setLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const publishOrder = async () => {
        setLoading(true)
        setDisabled(true)

        // pulish order implemenmtation
        const order = new Order(user, {
            price: toNumber(price),
            amount: toNumber(amount),
            closure,
            currency
        })

        await order.publish()

        setDisabled(false)
        setLoading(false)
    }

    return (
        <ScrollView style={theme.styles.scroll_container}>
            <HeaderScreen 
                title="Order Details"
                onClose={navigation.goBack()}
            />

            <Text style={styles.sats}>
                {amount}
            </Text>

            <View style={styles.buttonArea}>
                <ButtonPrimary disabled={disabled} loading={loading}
                    label={useTranslate("commons.publish")}
                    onPress={publishOrder}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sats: { color: theme.colors.white, fontSize: 25 },
    buttonArea: { width: "100%", paddingVertical: 10, marginVertical: 20 },
})

export default OrderDetailScreen
