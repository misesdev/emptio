import { ButtonPrimary } from "@components/form/Buttons"
import { StyleSheet, View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import NetworkOption from "../commons/NetworkOption"
import { useAccount } from "@src/context/AccountContext"
import { pushMessage } from "@services/notification"
import { BNetwork } from "bitcoin-tx-lib"
import { useState } from "react"
import theme from "@src/theme"
import SplashScreen from "@/src/components/general/SplashScreen"

const NetworkScreen = ({ navigation, route }: any) => {

    const { wallets, setWallets } = useAccount()
    const { name, mnemonic, passphrase } = route.params
    const [network, setNetwork] = useState<BNetwork>("mainnet")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [status, setStatus] = useState("")
    const { walletFactory, walletService } = useService()
    const { useTranslate } = useTranslateService()

    const createWallet = async () => {
        setLoading(true)
        setDisabled(true)
        setTimeout(async () => {
            setStatus("Derivando a master key bip39...")
            const masterKey = await walletFactory.create({ 
                mnemonic, passphrase, network 
            })
            setStatus("Criando a carteira HD bip39")
            const result = await walletService.add({
                name, 
                masterKey,
                network
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
                        Escolha a rede da carteira?
                    </Text>
                </View>
               
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} >
                        Esta será a rede a qual a carteira irá interagir, enviar e receber transações.  
                    </Text>
                </View>

                <View style={styles.optionContent}>
                    <NetworkOption
                        title={useTranslate("wallet.bitcoin.tag")}
                        description={"A Mainnet é a rede oficial do Bitcoin, usada para transações reais."}
                        chageNetwork={setNetwork}
                        networkOption="mainnet"
                        network={network} 
                    />
                    <NetworkOption
                        title={useTranslate("wallet.bitcoin.testnet.tag")}
                        description={"A Testnet é a rede de testes, onde as moedas não têm valor real — ideal para experimentar com segurança."}
                        chageNetwork={setNetwork}
                        networkOption="testnet"
                        network={network} 
                    />
                </View>
            </View>

            <View style={styles.buttonArea}>
                <ButtonPrimary
                    loading={loading}
                    disabled={disabled}
                    onPress={createWallet}
                    label={useTranslate("commons.continue")} 
                />
            </View>
        </ScrollView>    
    )
}

const styles = StyleSheet.create({
    content: { width: "100%", paddingVertical: 50 },
    titleContainer: { width: "100%", padding: 10, paddingVertical: 10 },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: theme.colors.white },
    descriptionContainer: { width: "100%", padding: 20 },
    description: { fontSize: 14, color: theme.colors.gray },
    optionContent: { width: "100%", padding: 10, marginVertical: 15 },
    buttonArea: { width: '100%', position: "absolute", bottom: 0, marginVertical: 20, 
        paddingHorizontal: 30 },
})

export default NetworkScreen
