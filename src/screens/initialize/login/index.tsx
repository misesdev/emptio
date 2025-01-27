import MessageBox, { showMessage } from "@components/general/MessageBox";
import { Image, StyleSheet, Text, View } from "react-native";
import { QRCodeTextBox } from "@components/form/TextBoxs";
import { ButtonPrimary } from "@components/form/Buttons";
import SplashScreen from "@components/general/SplashScreen";
import { validatePrivateKey } from "@src/services/nostr";
import { userService } from "@/src/core/userManager";
import { useAuth } from "@/src/providers/userProvider";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import theme from "@src/theme";
import { useTranslateService } from "@/src/providers/translateProvider";
import { pushMessage } from "@/src/services/notification";
import useNDKStore from "@/src/services/zustand/ndk";
import useChatStore from "@/src/services/zustand/chats";
import { subscribeUserChat } from "@/src/services/nostr/pool";
import Clipboard from "@react-native-clipboard/clipboard";

const LoginScreen = ({ navigation }: any) => {

    const { setNdkSigner } = useNDKStore()
    const { addChat } = useChatStore()
    const { setUser, setFollows } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [secretKey, setSecretKey] = useState("")

    useEffect(() => {
        checkClipboardContainsKey()

        AppState.addEventListener("change", handleAppStateChange)
    }, [])

    const checkClipboardContainsKey = async () => {
        // verify clipboard for a privateKey nostr
        const nsec = await Clipboard.getString()
        handlerClipboard(nsec)
    }

    const handleAppStateChange = (appstate: any) => {
        if (appstate === 'active')
            checkClipboardContainsKey()
    }

    const handlerClipboard = (key: string) => {
        if (validatePrivateKey(key)) {
            showMessage({
                title: useTranslate("commons.detectedkey"),
                message: useTranslate("message.detectedkey"),
                infolog: useTranslate("message.detectedkey.value") + key,
                action: {
                    label: useTranslate("commons.yes"), onPress: () => {
                        setSecretKey(key)
                    }
                }
            })
        }
    }

    const handlerLogin = async () => {
        setLoading(true)

        setTimeout(async () => {
            if (validatePrivateKey(secretKey))
            {
                try 
                {
                    const result = await userService.signIn({ secretKey, setUser, setFollows })

                    if (result.success && result.data) {
                        setNdkSigner(result.data)

                        subscribeUserChat({ user: result.data, addChat })

                        navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })                  
                    }
                } catch (ex) { 
                    pushMessage(ex as string)
                }
            } else
                showMessage({ message: useTranslate("message.invalidkey"), infolog: secretKey })

            setLoading(false)
        }, 100)
    }

    if (loading)
        return <SplashScreen message="" />

    return (
        <View style ={{ flex: 1 }}>
            <View style={theme.styles.container}>

                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("login.message")}</Text>

                <QRCodeTextBox placeholder={useTranslate("labels.privatekey")} onChangeText={setSecretKey} value={secretKey} />

                <View style={{ height: 100 }}></View>
                
                <View style={styles.buttonArea}>
                    <ButtonPrimary label={useTranslate("commons.signin")} onPress={handlerLogin} />
                </View>
            </View>
            <MessageBox />
        </View>
    )
}

const styles = StyleSheet.create({
    logo: { maxWidth: "90%", maxHeight: "26%", marginTop: -100 },
    title: { marginVertical: 25, color: theme.colors.gray, textAlign: "center", width: "85%" },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginBottom: 40, flexDirection: "row", bottom: 10 }
})

export default LoginScreen
