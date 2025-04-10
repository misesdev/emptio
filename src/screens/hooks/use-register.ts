import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { storageService } from "@services/memory"
import { pushUserFollows, subscribeUser } from "@services/nostr/pool"
import { pushMessage } from "@services/notification"
import { createFollowEvent, userService } from "@services/user"
import { getUserName } from "@src/utils"
import { useState } from "react"

export const useRegister = ({ navigation }: any) => {

    const { setUser, setFollowsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [userName, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const setUserName = (value: string) => {
        setDisabled(value.trim().length < 3)
        setName(value)
    }

    const register = async () => {
        if (userName.trim())
        {
            setLoading(true)
            setDisabled(true)

            const results = await userService.searchUsers({}, userName.trim())
          
            if(results.some(u => getUserName(u).trim() == userName.trim())) {
                setLoading(false)
                setDisabled(false)
                return pushMessage(`${useTranslate("register.already_exists")} ${userName.trim()}`)
            }

            await registerUser()

            setDisabled(false)
            setLoading(false)
        }
    }

    const registerUser = async () => {

        const result = await userService.signUp({ userName: userName.trim(), setUser })

        if (result.success && result.data) 
        {
            subscribeUser(result.data)

            const pairKey = await storageService.secrets.getPairKey(result.data.keychanges??"")
            
            const followsEvent = createFollowEvent(result.data ?? {}, [
                ["p", result.data.pubkey??""]
            ])

            await pushUserFollows(followsEvent, pairKey)

            if(setFollowsEvent) setFollowsEvent(followsEvent)

            return navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
        }
        pushMessage(`${useTranslate("message.request.error")} ${result.message}`)
    }

    return {
        loading,
        disabled,
        register,
        userName,
        setUserName
    }
}

