import { useService } from "@src/providers/ServiceProvider"
import useChatStore from "@services/zustand/useChatStore"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useRef, useState } from "react"

const useLoadMessages = (chat_id: string) => {

    const timeout:any = useRef(null)
    const [chatMessages, setChatMessages] = useState<NDKEvent[]>([])
    const { markReadChat, unreadChats } = useChatStore()
    const { messageService } = useService()
    
    useEffect(() => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(loadMessages, 10)
        return () => clearTimeout(timeout.current)
    }, [unreadChats])

    const loadMessages = async () => {
        if(!unreadChats.includes(chat_id)) return
        const result = await messageService.listMessages(chat_id)
        if(result.success) {
            setChatMessages(result.data??[])
            markReadChat(chat_id)
        }
    }
    
    return {
        chatMessages,
        setChatMessages
    }
}

export default useLoadMessages
