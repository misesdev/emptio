import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { useTranslate } from "@src/services/translate"
import { setStringAsync } from "expo-clipboard"
import QRCode from "react-native-qrcode-svg"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import theme from "@src/theme"
import { HeaderScreen } from "@components/general/HeaderPage"
import { ButtonPrimary } from "@components/form/Buttons"
import { useAuth } from "@src/providers/userProvider"


const WalletReceiveScreen = ({ navigation, route }: any) => {

    const { user } = useAuth()

    const [address, setAddress] = useState<string>(route.params?.address)
    const [valueText, setValueText] = useState<string>(route.params?.address)

    const handleCopyValue = async () => {

        await setStringAsync(address)

        setValueText(useTranslate("commons.copied"))

        setTimeout(() => setValueText(valueText), 1000)
    }

    return (
        <View style={styles.content}>

            {/* Header */}
            <HeaderScreen title={useTranslate("wallet.title.receive")} onClose={() => navigation.navigate("wallet-stack")} />

            {/* Body */}
            <View style={{ flex: 1, alignItems: "center" }}>

                {/* Profile Picture */}
                <View style={styles.image}>
                    {user.picture && <Image source={{ uri: user.picture }} style={{ flex: 1 }} />}
                    {!user.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ flex: 1 }} />}
                </View>
                {/* Profile Name */}
                <Text style={styles.userName}>{user.name}</Text>

                <View style={styles.qrcode}>
                    <QRCode
                        size={230}
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
    footer: { position: "absolute", bottom: 10, justifyContent: "center" },
    image: { width: 100, height: 100, overflow: "hidden", borderRadius: 50, backgroundColor: theme.colors.gray },
    userName: { color: theme.colors.white, fontSize: 18, fontWeight: "500", marginVertical: 15, textAlign: "center" }
})

export default WalletReceiveScreen