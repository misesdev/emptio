import { Modal, StatusBar, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { useTranslate } from "@src/services/translate"
import { setStringAsync } from "expo-clipboard"
import { ButtonPrimary } from "../form/Buttons"
import QRCode from "react-native-qrcode-svg"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import theme from "@src/theme"

type ReceiveModalProps = {
    address: string,
    visible: boolean,
    onClose: (visible: boolean) => void,
}

const WalletReceiveModal = ({ visible, onClose, address }: ReceiveModalProps) => {

    const [valueText, setValueText] = useState<string>(address)

    const handleCopyValue = async () => {

        await setStringAsync(address)

        setValueText(useTranslate("commons.copied"))

        setTimeout(() => setValueText(address), 1000)
    }

    return (
        <Modal visible={visible} animationType="slide" style={{ zIndex: 0 }} onRequestClose={() => onClose(false)}>
            <StatusBar hidden />
            <View style={styles.content}>

                <View style={styles.header}>
                    <View style={{ width: "75%", padding: 6 }}>
                        <Text style={styles.headertitle}>
                            {useTranslate("wallet.title.receive")}
                        </Text>
                    </View>
                    <View style={{ width: "25%", padding: 6, flexDirection: "row-reverse" }}>
                        <TouchableOpacity onPress={() => onClose(false)} activeOpacity={.7} style={styles.headerbutton} >
                            <Ionicons name="close" size={theme.icons.medium} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.qrcode}>
                    <QRCode
                        size={250}
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

                <View style={styles.footer}>
                    <ButtonPrimary label={useTranslate("commons.copy")} onPress={handleCopyValue} leftIcon="copy" />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: { flexDirection: "row", position: "absolute", top: 0, width: "100%" },
    headertitle: { color: theme.colors.white, fontSize: 20, fontWeight: "bold", margin: 15 },
    headerbutton: { borderRadius: 20, padding: 6, backgroundColor: theme.colors.gray, margin: 15 },
    qrcode: { padding: 8, borderRadius: 10, backgroundColor: theme.colors.white, marginVertical: 20 },
    content: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.black },
    copycontent: { padding: 12, marginVertical: 10, borderRadius: 8, backgroundColor: theme.colors.gray },
    copytext: { color: theme.colors.white, fontSize: 10 },
    footer: { position: "absolute", bottom: 10, justifyContent: "center" }
})

export default WalletReceiveModal