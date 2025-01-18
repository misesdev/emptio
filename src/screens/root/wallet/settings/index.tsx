import { useAuth } from "@src/providers/userProvider"
import { ScrollView, StyleSheet, View } from "react-native"
import { ButtonLink, ButtonPrimary } from "@components/form/Buttons"
import { walletService } from "@src/core/walletManager"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import SplashScreen from "@components/general/SplashScreen"
import { userService } from "@src/core/userManager"
import { FormControl, FormControlSwitch } from "@components/form/FormControl"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { SectionHeader } from "@components/general/section/headers"
import { LinkSection, SectionContainer } from "@components/general/section"
import { authService } from "@src/core/authManager"
import { pushMessage } from "@src/services/notification"
import { useState } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import { Wallet } from "@/src/services/memory/types"

const WalletSettings = ({ navigation, route }: any) => {

    const { wallet } = route.params as { wallet: Wallet }
    const { useTranslate } = useTranslateService()
    const { setWallets, user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState(wallet.name)
    const [defaultWallet, setDefaultWallet] = useState<boolean>(wallet.default ?? false)

    const hadleDeleteWallet = async () => {
        showMessage({
            title: useTranslate("message.wallet.wantdelete"),
            message: useTranslate("message.wallet.alertdelete"), 
            action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {

                    await walletService.delete(wallet ?? {})

                    if(setWallets) setWallets(await walletService.list())

                    navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                }
            }
        })
    }

    const handleViewSeed = async () => {

        const biometrics = await authService.checkBiometric()

        if(biometrics)
            navigation.navigate("seed-wallet-stack", { origin: "options", wallet })
    }

    const handleSave = async () => {

        setLoading(true)

        wallet.name = walletName
        wallet.default = defaultWallet

        if(wallet.default && wallet.key != user.default_wallet) 
        {           
            user.default_wallet = wallet.key
            user.bitcoin_address = wallet.address   

            await userService.updateProfile({ user, setUser, upNostr: true })
        }

        await walletService.update(wallet)

        if(setWallets) setWallets(await walletService.list())

        pushMessage(useTranslate("message.wallet.saved"))

        navigation.navigate("wallet-stack", { wallet })
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderScreen
                title={useTranslate("wallet.title.settings")}
                onClose={() => navigation.navigate("wallet-stack", { wallet })}
            />

            <ScrollView contentContainerStyle={[theme.styles.scroll_container, { justifyContent: "center" }]}>

                <FormControlSwitch label="Default Wallet" value={defaultWallet} onChangeValue={setDefaultWallet} />

                <FormControl label={useTranslate("labels.wallet.name")} value={walletName} onChangeText={setWalletName} />
                
                <SectionHeader label={useTranslate("commons.options")} />

                <SectionContainer style={{ width: "94%" }}>
                    <LinkSection icon="eye" label={useTranslate("labels.wallet.getseed")} onPress={handleViewSeed}/>
                </SectionContainer>

                <ButtonLink label={useTranslate("commons.delete")} color={theme.colors.red} onPress={hadleDeleteWallet}/>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <ButtonPrimary label={useTranslate("commons.save")} onPress={handleSave} />
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
