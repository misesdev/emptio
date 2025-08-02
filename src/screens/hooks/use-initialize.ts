import { EventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { getNotificationPermission } from "@services/permissions"
import { useTranslateService } from "@src/providers/translateProvider"
import { pushMessage } from "@services/notification"
import { useEffect, useState } from "react"

export const useInitialize = ({ navigation }: any) => {

    const { setChats } = useChatStore()
    const { setFollowsEvent } = useAuth()
    const { setNdkSigner } = useNDKStore()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => {  
        verifyLogon()
    }, [])

    const verifyLogon = async () => {

        try {
            await getNotificationPermission() 
            
            const result = await authService.isLogged()
            if (result.success && result.data) 
            {
                setNdkSigner(result.data)

                setChats(await messageService.listChats(result.data))

                subscribeUser(result.data ?? {})
                
                if(setFollowsEvent) 
                {
                    const eventFollow = await getEvent({ 
                        kinds:[EventKinds.followList], 
                        authors: [result.data.pubkey??""], 
                        limit: 1
                    })

                    if(eventFollow) setFollowsEvent(eventFollow)
                }                
                
                navigation.reset({ index: 0, routes: [{ name: "authenticate-stack" }] })
            }
        } catch {
            pushMessage(useTranslate("message.default_error"))
        }
        setLoading(false)
    }

    return {
        loading
    }
}
