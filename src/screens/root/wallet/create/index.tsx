import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/translateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { useState } from "react"
import theme from "@src/theme"
import { ScrollView } from "react-native-gesture-handler"

const CreateWalletScreen = ({ navigation }: StackScreenProps<any>) => {

    const [disabled, setDisabled] = useState(true)
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { useTranslate } = useTranslateService()

    const handleSetName = (value: string) => {
        setName(value)
        setTimeout(validateFields, 20)
    }

    const validateFields = () => setDisabled(name.length <= 2)

    const continueToNetwork = () => navigation.navigate("create-wallet-network", { 
        name, password 
    })

    return (
        <ScrollView contentContainerStyle={theme.styles.container}>
            <HeaderScreen 
                style={{ position: "absolute", top: 5 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ height: 20 }}></View>

            <Text style={styles.title}>Defina um nome para a sua carteira</Text>

            <FormControl  
                value={name} 
                onChangeText={handleSetName}                 
                label={useTranslate("labels.wallet.name")}
            />

            <FormControl type="password"
                value={password}
                label={useTranslate("labels.wallet.password")} 
                onChangeText={setPassword} 
            /> 
         
            <View style={styles.buttonArea}>
                <ButtonPrimary 
                    disabled={disabled} 
                    label={useTranslate("commons.continue")} 
                    onPress={continueToNetwork} 
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

export default CreateWalletScreen
