import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import SplashScreen from "@components/general/SplashScreen"
import { walletService } from "@src/core/walletManager"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { WalletType } from "@services/memory/types"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { StackScreenProps } from "@react-navigation/stack"

const ImportWalletScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { setWallets } = useAuth()
    const type = route?.params?.type as WalletType
    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState<string>("")
    const [seedPhrase, setSeedPhrase] = useState<string>("")
    const [passPhrase, setPassPhrase] = useState<string>()
    const { useTranslate } = useTranslateService()

    useEffect(() => {
        navigation.setOptions({
            header: () => <HeaderScreen
                title={useTranslate("screen.title.importwallet")}
                onClose={() => navigation.navigate("add-wallet-stack")}
            />
        })
    })

    const handleImport = async () => {

        var words = seedPhrase?.trim().split(" ")

        if (!walletName)
            return pushMessage(useTranslate("message.wallet.nameempty"))

        if (words && words?.length < 12 || words.length > 12)
            return pushMessage(`${useTranslate("message.wallet.invalidseed")} ${words.length}.`)
        
        setLoading(true)

        setTimeout(async () => {
            const response = await walletService.import({ 
                type,
                name: walletName.trim(),
                mnemonic: seedPhrase.trim(), 
                password: passPhrase?.trim() 
            })

            if(setWallets) setWallets(await walletService.list())

            setLoading(false)

            if (response.success)
                navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
            else if(response.message)
                pushMessage(response.message)
        }, 50)
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={theme.styles.container}>
            <Text style={styles.title}>{useTranslate("wallet.title.import")}</Text>

            <View style={{ alignItems: "center", marginVertical: 26 }}>
                <Text style={{ 
                    width: "50%", 
                    padding: 4,
                    borderRadius: 10,
                    textAlign: "center",
                    color: theme.colors.white, 
                    backgroundColor: type == "bitcoin" ? theme.colors.orange : theme.colors.green
                }}>
                    {type == "bitcoin" && useTranslate("wallet.bitcoin.tag")}
                    {type == "testnet" && useTranslate("wallet.bitcoin.testnet.tag")}
                </Text>
            </View>

            <FormControl  
                value={walletName} 
                onChangeText={setWalletName}                 
                label={useTranslate("labels.wallet.name")}
            />

            <FormControl label="Seed Phrase" value={seedPhrase} onChangeText={value => setSeedPhrase(value.toLowerCase())} isTextArea />
            
            <FormControl label={useTranslate("labels.wallet.password")} value={passPhrase} onChangeText={setPassPhrase} type="password" /> 
           
            {/* Footer */}
            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.import")} onPress={() => handleImport()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 25, fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    buttonArea: { width: '100%', justifyContent: 'center', marginVertical: 10, flexDirection: "row", marginTop: 50 }
})

export default ImportWalletScreen
