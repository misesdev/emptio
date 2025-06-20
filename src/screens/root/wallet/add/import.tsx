import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { WalletType } from "@services/memory/types"
import { useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { walletService } from "@services/wallet"
import theme from "@src/theme"
import { storageService } from "@services/memory"
import { ScrollView } from "react-native-gesture-handler"

const ImportWalletScreen = ({ navigation, route }: StackScreenProps<any>) => {

    const { setWallets } = useAuth()
    const type = route?.params?.type as WalletType
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [walletName, setWalletName] = useState<string>("")
    const [seedPhrase, setSeedPhrase] = useState<string>("")
    const [passPhrase, setPassPhrase] = useState<string>()
    const { useTranslate } = useTranslateService()

    const handleSetName = (value: string) => {
        setWalletName(value)
        setTimeout(Validate, 20)
    }

    const handleSetSeed = (value: string) => {
        setSeedPhrase(value)
        setTimeout(Validate, 20)
    }

    const Validate = () => {
        var words = seedPhrase?.trim().split(" ")
        if(words?.length != 12) return setDisabled(true)
        if(walletName.length <= 5) return setDisabled(true)
        return setDisabled(false)
    }

    const handleImport = async () => {

        setLoading(true)
        setDisabled(true)

        setTimeout(async () => {
            const response = await walletService.import({ 
                network: "testnet",
                name: walletName.trim(),
                mnemonic: seedPhrase.trim(), 
                password: passPhrase?.trim() 
            })

            if(setWallets) setWallets(await storageService.wallets.list())

            if (response.success)
                navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
            else if(response.message)
                pushMessage(response.message)
            
            setDisabled(false)
            setLoading(false)
        }, 20)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderScreen style={{ marginBottom: 10 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ width: "100%" }}>
                <View style={{ height: 30 }}></View>

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
                    onChangeText={handleSetName}                 
                    label={useTranslate("labels.wallet.name")}
                />

                <FormControl isTextArea
                    value={seedPhrase} 
                    label="Seed Phrase"
                    onChangeText={value => handleSetSeed(value.toLowerCase())}  
                />
                
                <FormControl type="password"
                    value={passPhrase}
                    label={useTranslate("labels.wallet.password")} 
                    onChangeText={setPassPhrase} 
                /> 
            </View>
           
            {/* Footer */}
            <View style={styles.buttonArea}>
                <ButtonPrimary 
                    loading={loading}
                    disabled={disabled} 
                    label={useTranslate("commons.import")} 
                    onPress={() => handleImport()} 
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

export default ImportWalletScreen
