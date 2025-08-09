import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { StackScreenProps } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import { useEffect, useState } from "react"
import theme from "@src/theme"

const WalletName = ({ navigation }: StackScreenProps<any>) => {

    const { useTranslate } = useTranslateService()
    const [disabled, setDisabled] = useState(true)
    const [name, setName] = useState<string>("")

    useEffect(() => {
        setDisabled(name.length <= 2)
    }, [name])

    const continueToNetwork = () => navigation.navigate("create-wallet-network", { 
        name 
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
                onChangeText={setName}                 
                label={useTranslate("labels.wallet.name")}
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

export default WalletName
