import { showMessage } from "@components/general/MessageBox"
import { useTranslateService } from "@src/providers/translateProvider"
import { pushMessage } from "@services/notification"
import Clipboard from "@react-native-clipboard/clipboard"
import { useEffect, useState } from "react"
import { AppState } from "react-native"
import AuthService from "@services/auth/AuthService"
import NostrPairKey from "@services/nostr/pairkey/NostrPairKey"
import { useAuth } from "@src/context/AuthContext"

const useLogin = () => {
 
    const { login } = useAuth()
    const authService = new AuthService()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [secretKey, setSecret] = useState("")

    useEffect(() => {
        checkClipboardContainsKey()
        const listener = AppState.addEventListener("change", handleAppStateChange)
        const clear = () => listener.remove() 
        return clear
    }, [])

    const setSecretKey = (value: string) => {
        setDisabled(!NostrPairKey.validateNsec(value))
        setSecret(value)
    }

    const checkClipboardContainsKey = async () => {
        // verify clipboard for a privateKey nostr
        const nsec = await Clipboard.getString()
        handlerClipboard(nsec)
    }

    const handleAppStateChange = (appstate: any) => {
        if (appstate === 'active') checkClipboardContainsKey()
    }

    const handlerClipboard = (key: string) => {
        if (NostrPairKey.validateNsec(key)) {
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

    const onLogin = async () => {
        setLoading(true)
        setDisabled(true)
        if (NostrPairKey.validateNsec(secretKey))
        {
            const result = await authService.signIn(secretKey)
            if(result.success) {
                login()
            } else {
                pushMessage(result.message??"")
            }
        } else {
            showMessage({ 
                message: useTranslate("message.invalidkey"), 
                infolog: secretKey 
            })
        }

        setDisabled(false)
        setLoading(false)
    }

    return {
        loading,
        disabled,
        secretKey,
        onLogin,
        setSecretKey
    }
}

export default useLogin
