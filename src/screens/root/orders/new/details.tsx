import theme from "@src/theme"
import { StyleSheet, ScrollView, View, Text } from "react-native"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import DatePicker from "react-native-date-picker"
import useCreateOrder from "../hooks/use-create-order"

const OrderDetailScreen = ({ navigation, route }: any) => {

    const { useTranslate } = useTranslateService()
    const { 
        loading, disabled, amount, setClosure, publishOrder 
    } = useCreateOrder({ navigation, route })

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title="Order Details"
                onClose={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={theme.styles.scroll_container}>

                <Text style={styles.sats}>
                    {amount} sats
                </Text>

                <View style={{ justifyContent: "center" }}>
                    <View>
                        <Text style={{ color: theme.colors.white, fontWeight: "500", fontSize: 20 }}>
                            Data de vencimento da ordem
                        </Text>
                    </View>
                    <DatePicker 
                        date={new Date()} 
                        onDateChange={date => setClosure(date.getDate())} 
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonArea}>
                <ButtonPrimary disabled={disabled} loading={loading}
                    label={useTranslate("commons.publish")}
                    onPress={publishOrder}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sats: { color: theme.colors.white, fontWeight: "500", fontSize: 25 },
    buttonArea: { width: "100%", paddingVertical: 10, marginVertical: 20 },
})

export default OrderDetailScreen
