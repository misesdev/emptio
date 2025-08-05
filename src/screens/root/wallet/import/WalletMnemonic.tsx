import { ButtonPrimary } from "@components/form/Buttons"
import { FormControl } from "@components/form/FormControl"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { StyleSheet, View, Text } from "react-native"
import { useState } from "react"
import theme from "@src/theme"

const WalletMnemonic = ({ navigation, route }: any) => {

    const { name, network } = route.params
    const [mnemonic, setMnemonic] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const { useTranslate } = useTranslateService()

    const handleSetSeed = (value: string) => {
        setMnemonic(value.toLowerCase())
        setTimeout(validateFields, 20)
    }
    
    const validateFields = () => {
        var words = mnemonic?.trim().split(" ")
        setDisabled(words.length != 12)
    }

    const importWallet = async () => {
        setLoading(true)
        setDisabled(true)

        // setTimeout(async () => {
        //     const response = await walletService.import({ 
        //         name,
        //         network,
        //         mnemonic: mnemonic.trim(), 
        //         password: password?.trim() 
        //     })

        //     if(setWallets) setWallets(await storageService.wallets.list())

        //     if (response.success)
        //         navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
        //     else if(response.message)
        //         pushMessage(response.message)
        //     
        //     setDisabled(false)
        //     setLoading(false)
        // }, 20)
    }

    return (
        <View style={theme.styles.container}>
            <HeaderScreen style={{ position: "absolute", top: 10 }}
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.goBack()}
            />

            <View style={{ height: 20 }}></View>

            <Text style={styles.title}>Preencha a frase semente</Text>
            
            <FormControl 
                isTextArea
                value={mnemonic} 
                label="Seed Phrase"
                onChangeText={handleSetSeed}  
            />    

            <FormControl type="password"
                value={password}
                label={useTranslate("labels.wallet.password")} 
                onChangeText={setPassword} 
            /> 

            <View style={styles.buttonArea}>
                <ButtonPrimary
                    loading={loading}
                    disabled={disabled}
                    onPress={importWallet}
                    label={useTranslate("commons.create")} 
                />
            </View>
        </View>    
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 25, fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    buttonArea: { width: '100%', justifyContent: 'center', marginVertical: 10, flexDirection: "row", marginTop: 50 },
})

export default WalletMnemonic
