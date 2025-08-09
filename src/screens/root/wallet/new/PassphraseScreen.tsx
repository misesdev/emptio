import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import { useState } from "react"
import theme from "@src/theme"

const WalletPassphrase = ({ navigation }: StackScreenProps<any>) => {

    const [disabled, setDisabled] = useState(true)
    const [passphrase, setPassphrase] = useState<string>("")
    const { useTranslate } = useTranslateService()

    const handleSetPassphrase = (value: string) => {
        setPassphrase(value)
        setTimeout(validateFields, 20)
    }

    const validateFields = () => setDisabled(passphrase.length <= 2)

    return (
        <ScrollView contentContainerStyle={theme.styles.container}>
            <HeaderScreen 
                style={{ position: "absolute", top: 5 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ height: 20 }}></View>

            <Text style={styles.title}>Defina uma passphrase para a sua carteira</Text>

            <FormControl type="password"
                value={passphrase}
                label={useTranslate("labels.wallet.password")} 
                onChangeText={handleSetPassphrase} 
            /> 
         
            <View style={styles.buttonArea}>
                <ButtonPrimary 
                    disabled={disabled} 
                    label={useTranslate("commons.create")} 
                    onPress={() => {}} 
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.colors.black },
    title: { fontSize: 25, fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    buttonArea: { width: '100%', justifyContent: 'center', marginVertical: 10, flexDirection: "row", marginTop: 50 }
})

export default WalletPassphrase
