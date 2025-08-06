import { useEffect, useMemo, useState } from "react"
import useChatStore from "@services/zustand/useChatStore"
import useNDKStore from "@services/zustand/useNDKStore"
import MessageService from "@services/message/MessageService"
import { SubscriptionService } from "@services/nostr/SubscriptionService"
import { User } from "@services/user/types/User"

const useLoadSubscription = (user: User) => {
    
    const { setChats } = useChatStore()
    const { setNdkSigner, ndk } = useNDKStore()
    const subscriber = useMemo(() => new SubscriptionService(ndk), [])
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        const subscribe = async () => openSubscription()
        subscribe()
    }, [user.pubkey])

    const openSubscription = async () => {

        const messageService = new MessageService(user)
        const chats = await messageService.listChats()
        if(chats.success) 
            setChats(chats.data ?? [])
        
        if(user.keyRef) 
        {
            await setNdkSigner(user)
            subscriber.subscribeUser(user)
        }
        setLoading(false)
    }

    return {
        loading
    }
}

export default useLoadSubscription
