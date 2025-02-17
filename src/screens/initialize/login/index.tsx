import MessageBox, { showMessage } from "@components/general/MessageBox";
import { Image, StyleSheet, Text, View } from "react-native";
import { QRCodeTextBox } from "@components/form/TextBoxs";
import { ButtonPrimary } from "@components/form/Buttons";
import { validatePrivateKey } from "@services/nostr";
import { userService } from "@src/core/userManager";
import { useAuth } from "@src/providers/userProvider";
import { useEffect, useState } from "react";
import { useTranslateService } from "@src/providers/translateProvider";
import { pushMessage } from "@services/notification";
import useNDKStore from "@services/zustand/ndk";
import useChatStore from "@services/zustand/chats";
import { subscribeUser } from "@services/nostr/pool";
import Clipboard from "@react-native-clipboard/clipboard";
import { AppState } from "react-native";
import theme from "@src/theme";
import { getEvent } from "@/src/services/nostr/events";
import { NostrEventKinds } from "@/src/constants/Events";

const LoginScreen = ({ navigation }: any) => {

    const { setNdkSigner } = useNDKStore()
    const { addChat } = useChatStore()
    const { setUser, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [secretKey, setSecretKey] = useState("")

    useEffect(() => {
        checkClipboardContainsKey()

        AppState.addEventListener("change", handleAppStateChange)
    }, [])

    const setValidateSecretKey = (value: string) => {
        setDisabled(!validatePrivateKey(value))
        setSecretKey(value)
    }

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
                        setValidateSecretKey(key)
                    }
                }
            })
        }
    }

    const handlerLogin = async () => {
        setLoading(true)
        setDisabled(true)
        setTimeout(async () => {
            if (validatePrivateKey(secretKey))
            {
                try 
                {
                    const result = await userService.signIn({ secretKey, setUser })

                    if (result.success && result.data) {
                        setNdkSigner(result.data)

                        subscribeUser({ user: result.data ?? {}, addChat })

                        if(setFollowsEvent) 
                        {
                            const eventFollow = await getEvent({ 
                                kinds:[NostrEventKinds.followList], 
                                authors: [result.data?.pubkey ?? ""], 
                                limit: 1
                            })

                            if(eventFollow) setFollowsEvent(eventFollow)
                        } 

                        navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })                  
                    }
                } catch (ex) { 
                    pushMessage(ex as string)
                }
            } else
                showMessage({ message: useTranslate("message.invalidkey"), infolog: secretKey })

            setLoading(false)
            setDisabled(false)
        }, 20)
    }

    return (
        <View style ={{ flex: 1 }}>
            <View style={theme.styles.container}>

                <Image style={styles.logo} source={require("@assets/emptio.png")} />

                <Text style={styles.title}>{useTranslate("login.message")}</Text>

                <QRCodeTextBox value={secretKey}
                    placeholder={useTranslate("labels.privatekey")} 
                    onChangeText={setValidateSecretKey}
                />

                <View style={{ height: 100 }}></View>
                
                <View style={styles.buttonArea}>
                    <ButtonPrimary disabled={disabled} loading={loading}
                        label={useTranslate("commons.signin")} 
                        onPress={handlerLogin} 
                        style={{ backgroundColor: disabled ? theme.colors.disabled
                            : theme.colors.blue
                        }}
                    />
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
