import { EventKinds } from "@src/constants/Events"
import { useAuth } from "@src/providers/userProvider"
import { DBEvents } from "@services/memory/database/events"
import { messageService } from "@services/message"
import { getEvent } from "@services/nostr/events"
import { getNostrInstance, subscribeUser } from "@services/nostr/pool"
import { getNotificationPermission } from "@services/permissions"
import useChatStore from "@services/zustand/chats"
import { useFeedVideosStore } from "@services/zustand/feedVideos"
import useNDKStore from "@services/zustand/ndk"
import { useEffect, useState } from "react"
import { pushMessage } from "@services/notification"
import { useTranslateService } from "@src/providers/translateProvider"
import { authService } from "@services/auth"

export const useInitialize = ({ navigation }: any) => {

    const { setChats } = useChatStore()
    const { setFollowsEvent } = useAuth()
    const { initialize } = useFeedVideosStore()
    const { setNDK, setNdkSigner } = useNDKStore()
    const [loading, setLoading] = useState(true)
    const { useTranslate } = useTranslateService()

    useEffect(() => {  
        initialize()
        verifyLogon()
    }, [])

    const verifyLogon = async () => {

        try {
            await DBEvents.initDatabase()
            
            setNDK(await getNostrInstance({ }))
            
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
