import { StyleSheet, View, Text } from "react-native"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { ScrollView } from "react-native-gesture-handler"
import { useService } from "@src/providers/ServiceProvider"
import { HDWallet, MnemonicUtils } from "bitcoin-tx-lib"
import { pushMessage } from "@services/notification"
import { useAccount } from "@src/context/AccountContext"
import SplashScreen from "@components/general/SplashScreen"
import MnemonicInput from "../commons/MnemonicInput"
import { useState } from "react"
import theme from "@src/theme"

const ImportationScreen = ({ navigation, route }: any) => {

    const { action, name } = route.params
    const { wallets, setWallets } = useAccount()
    const { useTranslate } = useTranslateService()
    const [disabled, setDisabled] = useState(true)
    const [mnemonic, setMnemonic] = useState("")
    const [wordCount, setWordCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState("")
    const extendFormats = ["xpub", "xpri", "zpub", "zpri"]
    const { walletService } = useService()

    const setMnemonicValue = (value: string) => {
        const trimmed = value.trim()
        if(extendFormats.includes(trimmed.slice(0,4))) {
            return setDisabled(false)
        }
        const words = trimmed.split(" ")
        if(words.length == 12) {
            const isValid = MnemonicUtils.validateMnemonic(trimmed)
            if(!isValid) {
                setError("Frase mnemonica inválida")
            }
            setDisabled(!isValid)
        }
        if(words.length > 12) return;
        setWordCount(words.length)
        setMnemonic(value)
    }

    const continueToNetwork = async () => {
        setDisabled(true)
        const trimmed = mnemonic.trim()
        if(extendFormats.includes(trimmed.slice(0,4))) {
            return await importFromDerivation(trimmed) 
        }
        if(trimmed.split(" ").length == 2) {
            navigation.navigate("wallet-passphrase", {
                action, name, mnemonic: trimmed
            })
        }
        setDisabled(false)
    }

    const importFromDerivation = async (input: string) => {
        setTimeout(async () => {
            setStatus("Derivando a master key bip39...")
            const { wallet } = HDWallet.import(input)
            setStatus("Criando a carteira HD bip39")
            const result = await walletService.add({
                masterKey: wallet.getMasterPrivateKey(),
                network: wallet.network,
                name
            })
            if(result.success && result.data) {
                setWallets([...wallets, result.data])
                navigation.reset({ 
                    routes: [{ name: "home" }], 
                    index: 0
                })
            }   
            if(!!result.success && result.message)
                pushMessage(result.message)
            setDisabled(false)
            setLoading(false)
        }, 20)
    }

    if(loading)
        return <SplashScreen message={status} />

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Importar Carteira
                    </Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} >
                        Cole ou digite sua frase mnemônica de 12 palavras ou sua chave 
                        estendida (xpriv/xpub/zpriv/zpub).  
                    </Text>
                    {error && <Text style={styles.errorMessage}>{error}</Text>}
                </View>
               
                <View style={{ paddingHorizontal: 10 }}>
                    <MnemonicInput  
                        value={mnemonic}
                        placeholder=""
                        onChangeText={setMnemonicValue}                 
                    />
                    {wordCount > 1 &&
                        <Text style={styles.wordCount}>{wordCount}/12</Text>
                    }
                </View>
            </View>

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
    content: { width: "100%", paddingVertical: 50 },
    titleContainer: { padding: 10, paddingVertical: 10 },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    descriptionContainer: { width: "100%", padding: 20, marginVertical: 10 },
    description: { fontSize: 14, color: theme.colors.gray },
    errorMessage: { color: theme.colors.red, fontSize: 14, marginTop: 5, textAlign: "center" },
    buttonArea: { width: "100%", position: "absolute", bottom: 0, paddingVertical: 16, 
        paddingHorizontal: 30 },
    wordCount: { marginHorizontal: 10, fontSize: 14, color: theme.colors.gray }
})

export default ImportationScreen
