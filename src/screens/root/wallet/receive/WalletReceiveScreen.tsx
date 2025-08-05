import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import { useAccount } from "@src/context/AccountContext"
import { Utilities } from "@src/utils/Utilities"
import { useEffect, useState } from "react"
import theme from "@src/theme"

const WalletReceiveScreen = ({ navigation, route }: any) => {

    const { user } = useAccount()
    const { useTranslate } = useTranslateService()
    const [address, setAddress] = useState("")
    const [pictureError, setPictureError] = useState<boolean>(false)
    const { walletService } = useService()

    useEffect(() => {
        loadAddress()
    }, [])

    const loadAddress = async () => {
        await walletService.init(route.params?.id as string)
        const addresses = await walletService.listReceiveAddresses(15)
        // const result = await walletService.listTransactions(true)
        // if(result.success && result.data) {
        //     const received = result.data.filter(t => t.type == "received")
        //         .map(t => t.participants)
        // }
        setAddress(addresses[0])
    }

    const handleCopyValue = async () => {

        Utilities.copyToClipboard(address) 

        setAddress(useTranslate("commons.copied"))

        setTimeout(() => loadAddress(), 1000)
    }

    return (
        <View style={styles.content}>

            {/* Header */}
            <HeaderScreen title={useTranslate("wallet.title.receive")} onClose={() => navigation.goBack()} />

            {/* Body */}
            <View style={{ flex: 1, alignItems: "center" }}>

                {/* Profile Picture */}
                <View style={styles.image}>
                    <Image style={{ width: 100, height: 100 }}
                        onError={() => setPictureError(true)} 
                        source={(pictureError || !user.picture) ? require("@assets/images/defaultProfile.png")
                            : { uri: user.picture }
                        } 
                    />
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
                        logo={require("@assets/icon.png")}
                        backgroundColor={theme.colors.white}
                    />
                </View>

                <TouchableOpacity activeOpacity={.7} onPress={handleCopyValue} style={styles.copycontent}>
                    <Text style={styles.copytext}>{}</Text>
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
    qrcode: { padding: 12, borderRadius: 10, backgroundColor: theme.colors.white,
        marginVertical: 20 },
    content: { flex: 1, justifyContent: "center", alignItems: "center",
        backgroundColor: theme.colors.black },
    copycontent: { padding: 12, marginVertical: 10, borderRadius: 8, 
        backgroundColor: theme.colors.gray },
    copytext: { color: theme.colors.white, fontSize: 10, textAlign: "center" },
    footer: { position: "absolute", bottom: 40, justifyContent: "center" },
    image: { width: 100, height: 100, overflow: "hidden", borderRadius: 50, 
        backgroundColor: theme.colors.black },
    userName: { color: theme.colors.white, fontSize: 18, fontWeight: "500", marginVertical: 15, 
        textAlign: "center" }
})

export default WalletReceiveScreen
