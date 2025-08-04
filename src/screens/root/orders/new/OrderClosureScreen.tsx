import theme from "@src/theme"
import { StyleSheet, ScrollView, View, Text } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import DatePicker from "react-native-date-picker"
import useClosureOrder from "../hooks/useClosureOrder"

const OrderClosureScreen = ({ navigation, route }: any) => {

    const { useTranslate } = useTranslateService()
    const { 
        loading, disabled, closure, setClosure, publishOrder 
    } = useClosureOrder({ navigation, route })

    return (
        <View style={{ flex: 1 }}>
            <HeaderScreen 
                title="Vencimento da Ordem"
                onClose={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={[theme.styles.scroll_container, {
                justifyContent: "center"
            }]}>

                <Text style={styles.title}>
                    Data de vencimento da ordem de venda
                </Text>

                <View style={styles.dateArea}>
                    <DatePicker
                        date={new Date(Math.floor(closure * 1000))}
                        onDateChange={date => setClosure(date.valueOf())} 
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
    title: { fontSize: 25, maxWidth: "90%", fontWeight: "bold", textAlign: "center",
        color: theme.colors.white },
    dateArea: { marginVertical: 100, justifyContent: "center" },

    buttonArea: { width: "100%", paddingVertical: 10, marginVertical: 20, alignItems: "center" },
})

export default OrderClosureScreen
