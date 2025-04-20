import { showMessage } from "@components/general/MessageBox"
import { EventKinds } from "@src/constants/Events"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { validatePrivateKey } from "@services/nostr"
import { getEvent } from "@services/nostr/events"
import { subscribeUser } from "@services/nostr/pool"
import { pushMessage } from "@services/notification"
import useNDKStore from "@services/zustand/ndk"
import Clipboard from "@react-native-clipboard/clipboard"
import { useEffect, useState } from "react"
import { AppState } from "react-native"
import { authService } from "@services/auth"

export const useLogin = ({ navigation }: any) => {
   
    const { setNdkSigner } = useNDKStore()
    const { setUser, setFollowsEvent } = useAuth()
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
        setDisabled(!validatePrivateKey(value))
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

    const login = async () => {
        setLoading(true)
        setDisabled(true)
        if (validatePrivateKey(secretKey))
        {
            try 
            {
                const result = await authService.signIn({ secretKey, setUser })

                if (result.success && result.data)
                {
                    setNdkSigner(result.data)
                    subscribeUser(result.data)

                    if(setFollowsEvent) 
                    {
                        const eventFollow = await getEvent({ 
                            kinds:[EventKinds.followList], 
                            authors: [result.data?.pubkey ?? ""], 
                            limit: 1
                        })

                        if(eventFollow) setFollowsEvent(eventFollow)
                    } 

                    navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })                  
                } else {
                    pushMessage(result.message??"")
                }
            } catch (ex) { 
                pushMessage(ex as string)
            }
        } else
            showMessage({ message: useTranslate("message.invalidkey"), infolog: secretKey })

        setDisabled(false)
        setLoading(false)
    }

    return {
        loading,
        disabled,
        secretKey,
        login,
        setSecretKey
    }
}
