
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useTranslate } from "@src/services/translate"
import { ButtonLink, ButtonPrimary } from "@components/form/Buttons"
import { Ionicons } from "@expo/vector-icons"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import SplashScreen from "@components/general/SplashScreen"
import { walletService } from "@src/core/walletManager"
import { HeaderScreen } from "@components/general/HeaderScreen"
import { FormControl } from "@components/form/FormControl"
import { useState } from "react"
import theme from "@src/theme"

const AddWalletScreen = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState<string>()
    const [walletType, setWalletType] = useState<"bitcoin" | "lightning">("bitcoin")

    const handleWalletType = (type: "bitcoin" | "lightning") => {
        setWalletType(type)
    }

    const handleCreate = async () => {
        if (!walletName || walletName.length <= 5)
            return alertMessage(useTranslate("message.wallet.nameempty"))

        setLoading(true)

        setTimeout(async () => {

            const response = await walletService.create({ name: walletName, type: walletType })

            if (response.success)
                navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
            else
                alertMessage(response.message)

            setLoading(false)
        }, 100)
    }

    if (loading)
        return <SplashScreen />

    return (
        <>
            <HeaderScreen
                title={useTranslate("screen.title.addwallet")}
                onClose={() => navigation.navigate("core-stack")}
            />

            <View style={theme.styles.container} >

                <FormControl label={useTranslate("labels.wallet.name")} value={walletName} onChangeText={setWalletName} />

                <View style={{ width: "100%", alignItems: "center", marginVertical: 30 }}>
                    <TouchableOpacity activeOpacity={.7}
                        style={[styles.selection, { borderWidth: walletType == "bitcoin" ? 2 : 0 }]}
                        onPress={() => handleWalletType("bitcoin")}
                    >
                        <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                            {/* <Image source={{ uri: "" }} style={{ }}/> */}
                            <Ionicons name="logo-bitcoin" size={theme.icons.large} color={theme.colors.orange} />
                        </View>
                        <View style={{ width: "85%" }}>
                            <Text style={[styles.typeTitle, { color: theme.colors.white }]}>Bitcoin</Text>
                            <Text style={styles.typeDescription}>description type wallet</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1}
                        style={[styles.selection, { borderWidth: walletType == "lightning" ? 2 : 0 }]}
                        onPress={() => { handleWalletType("bitcoin") }}
                    >
                        <View style={{ width: "15%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                            {/* <Image source={{ uri: "" }} style={{ }}/> */}
                            <Ionicons name="flash" size={theme.icons.large} color={theme.colors.yellow} />
                        </View>
                        <View style={{ width: "85%" }}>
                            <Text style={[styles.typeTitle, { color: theme.colors.white }]}>Lightning</Text>
                            <Text style={styles.typeDescription}>{useTranslate("message.shortly")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Import wallet from seed phrase */}

                <ButtonLink label={useTranslate("commons.import")} onPress={() => navigation.navigate("import-wallet-stack")} color={theme.colors.gray} />

                <View style={styles.buttonArea}>
                    <ButtonPrimary label={useTranslate("commons.create")} onPress={() => handleCreate()} />
                </View>

            </View>
            <AlertBox />
        </>
    )
}

const styles = StyleSheet.create({
    title: { top: 50, fontSize: 22, fontWeight: 'bold', position: "absolute", color: theme.colors.white },
    selection: { width: "90%", minHeight: 20, maxHeight: 100, borderRadius: 16, marginVertical: 10, flexDirection: "row", borderColor: theme.colors.white, backgroundColor: theme.colors.default },
    typeTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, color: theme.colors.white },
    typeDescription: { marginBottom: 15, color: theme.colors.gray },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginVertical: 10, flexDirection: "row", bottom: 10 }
})

export default AddWalletScreen