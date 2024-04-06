import { useAuth } from "@src/providers/userProvider"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { HeaderPageWallet } from "../components"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { walletService } from "@src/core/walletManager"
import { TextBox } from "@components/form/TextBoxs"
import { LinkSection, SectionContainer } from "@components/general/section"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { useState } from "react"
import theme from "@src/theme"

const WalletSttings = ({ navigation, route }: any) => {

    const { wallet, setWallet } = useAuth()
    const [walletName, setWalletName] = useState(wallet.name)

    const hadleDeleteWallet = async () => {

        await walletService.delete(wallet ?? {})

        navigation.navigate("core-stack")
    }

    const handleSave = async () => {
        
        wallet.name = walletName

        await walletService.update(wallet)

        if (setWallet)
            setWallet(wallet)

        alertMessage(useTranslate("message.wallet.saved"))

        setTimeout(() => navigation.navigate("wallet-stack"), 500)        
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderPageWallet
                title={useTranslate("wallet.title.settings")}
                onClose={() => navigation.navigate("wallet-stack")}
            />

            <ScrollView contentContainerStyle={[theme.styles.scroll_container, { justifyContent: "center" }]}>

                <TextBox value={walletName} onChangeText={setWalletName} placeholder={useTranslate("labels.wallet.name")} />

                <SectionContainer style={{ maxWidth: "90%" }}>
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                </SectionContainer>

                <SectionContainer style={{ maxWidth: "90%" }}>
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                </SectionContainer>

                <TouchableOpacity style={{ margin: 15, padding: 10 }} >
                    <Text style={{ color: theme.colors.red,  }}>{useTranslate("commons.delete")}</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <ButtonPrimary label={useTranslate("commons.save")} onPress={handleSave} />
            </View>

            <AlertBox />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: "center",
        color: theme.colors.white
    },
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
    footer: { width: "100%", position: "absolute", bottom: 10, alignItems: "center" }
})

export default WalletSttings