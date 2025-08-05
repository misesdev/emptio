import { ScrollView, StyleSheet, View } from "react-native"
import { ButtonLink, ButtonPrimary } from "@components/form/Buttons"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import { FormControl, FormControlSwitch } from "@components/form/FormControl"
import { useAccount } from "@src/context/AccountContext"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { Wallet } from "@services/wallet/types/Wallet"
import { useService } from "@src/providers/ServiceProvider"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { pushMessage } from "@services/notification"
import { useState } from "react"
import theme from "@src/theme"


const WalletSettings = ({ navigation, route }: any) => {

    const { wallet } = route.params
    const { walletService } = useService()
    const { useTranslate } = useTranslateService()
    const { setWallets, user, setUser } = useAccount()
    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState(wallet.name)
    const [defaultWallet, setDefaultWallet] = useState<boolean>(wallet.default ?? false)
    const [payfee, setPayfee] = useState<boolean>(wallet.payfee ?? false)

    const hadleDeleteWallet = async () => {
        showMessage({
            title: useTranslate("message.wallet.wantdelete"),
            message: useTranslate("message.wallet.alertdelete"), 
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {

                    await walletService.delete(wallet ?? {})

                    if(setWallets) setWallets(await walletService.list())

                    navigation.reset({ index: 0, routes: [{ name: "home" }] })
                }
            }
        })
    }

    const handleSave = async () => {

        setLoading(true)

        await walletService.update("id", {
            ...wallet,
            name: walletName,
            default: defaultWallet,
            payfee
        })

        if(setWallets) setWallets(await walletService.list())

        pushMessage(useTranslate("message.wallet.saved"))

        navigation.reset({
            index: 1,
            routes: [
                { name: 'core-stack' },
                { name: 'wallet', params: { id: "id" } }
            ]
        }) 
    }

    return (
        <View style={styles.container}>
            
            <HeaderScreen
                title={useTranslate("wallet.title.settings")}
                onClose={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={[theme.styles.scroll_container, { justifyContent: "center" }]}>

                <FormControl 
                    label={useTranslate("labels.wallet.name")} 
                    value={walletName}
                    onChangeText={setWalletName} 
                />
                
                <FormControlSwitch 
                    label={useTranslate("wallet.label.default")} 
                    value={defaultWallet}
                    onChangeValue={setDefaultWallet}
                />
                
                <FormControlSwitch 
                    label={useTranslate("wallet.label.payfee")} 
                    value={payfee} 
                    onChangeValue={setPayfee} 
                />
                
                {/* <FormControlSwitch  */}
                {/*     label={useTranslate("wallet.label.testmode")}  */}
                {/*     value={testnet} */}
                {/*     onChangeValue={setTestnet}  */}
                {/* />  */}

                <ButtonLink 
                    label={useTranslate("commons.delete")} 
                    color={theme.colors.red} 
                    onPress={hadleDeleteWallet}
                />

            </ScrollView>

            <View style={styles.footer}>
                <ButtonPrimary
                    loading={loading} 
                    label={useTranslate("commons.save")} 
                    onPress={handleSave}
                />
            </View>

            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 20, textAlign: "center", color: theme.colors.white },
    container: { backgroundColor: theme.colors.black, height: "100%" },
    footer: { width: "100%", position: "absolute", bottom: 40, alignItems: "center" }
})

export default WalletSettings
