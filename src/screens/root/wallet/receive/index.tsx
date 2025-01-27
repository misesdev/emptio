import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import { useAuth } from "@src/providers/userProvider"
import { useState } from "react"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import { copyToClipboard } from "@/src/utils"

const WalletReceiveScreen = ({ navigation, route }: any) => {

    const { user } = useAuth()
    const { wallet } = route.params
    const { useTranslate } = useTranslateService()
    const [address, setAddress] = useState<string>(wallet?.address)
    const [valueText, setValueText] = useState<string>(wallet?.address)

    const handleCopyValue = async () => {

        copyToClipboard(valueText) 

        setValueText(useTranslate("commons.copied"))

        setTimeout(() => setValueText(valueText), 1000)
    }

    return (
        <View style={styles.content}>

            {/* Header */}
            <HeaderScreen title={useTranslate("wallet.title.receive")} onClose={() => navigation.navigate("wallet-stack", { wallet })} />

            {/* Body */}
            <View style={{ flex: 1, alignItems: "center" }}>

                {/* Profile Picture */}
                <View style={styles.image}>
                    {user.picture && <Image onError={() => user.picture = ""} source={{ uri: user.picture }} style={{ flex: 1 }} />}
                    {!user.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 100, height: 100 }} />}
                </View>
                {/* Profile Name */}
                <Text style={styles.userName}>{user.name}</Text>

                {/* Qrcode */}
                <View style={styles.qrcode}>
                    <QRCode
                        size={240}
                        value={address}
                        logoSize={75}
                        logoBorderRadius={12}
                        logo={require("assets/icon.png")}
                        backgroundColor={theme.colors.white}
                    />
                </View>

                <TouchableOpacity activeOpacity={.7} onPress={handleCopyValue} style={styles.copycontent}>
                    <Text style={styles.copytext}>{valueText}</Text>
                </TouchableOpacity>

            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <ButtonPrimary label={useTranslate("commons.copy")} onPress={handleCopyValue} leftIcon="copy" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    qrcode: { padding: 12, borderRadius: 10, backgroundColor: theme.colors.white, marginVertical: 20 },
    content: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.black },
    copycontent: { padding: 12, marginVertical: 10, borderRadius: 8, backgroundColor: theme.colors.gray },
    copytext: { color: theme.colors.white, fontSize: 10, textAlign: "center" },
    footer: { position: "absolute", bottom: 40, justifyContent: "center" },
    image: { width: 100, height: 100, overflow: "hidden", borderRadius: 50, backgroundColor: theme.colors.gray },
    userName: { color: theme.colors.white, fontSize: 18, fontWeight: "500", marginVertical: 15, textAlign: "center" }
})

export default WalletReceiveScreen
