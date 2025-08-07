import { useService } from "@src/providers/ServiceProvider"
import useChatStore from "@services/zustand/useChatStore"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { RefObject, useCallback, useState } from "react"
import { User } from "@services/user/types/User"
import useLoadMessages from "./useLoadMessages"

type Props = {
    user: User;
    chat_id: string;
    selectedItems: RefObject<Set<NDKEvent>>; 
}

const useMessages = ({ user, chat_id, selectedItems }: Props) => {

    const [message, setMessage] = useState<string>("")
    const [replyMessage, setReplyMessage] = useState<NDKEvent|null>(null)
    const { removeChat, selectionMode, toggleSelectionMode } = useChatStore()
    const { chatMessages, setChatMessages } = useLoadMessages(chat_id)
    const { messageService } = useService()
    
    const sendMessage = useCallback(async (follow: User) => {
        if(!message.trim().length) return
        const event = await  messageService.send({ 
            message, 
            receiver: follow.pubkey,
            replyEvent: replyMessage
        })
        setChatMessages(prev => [...prev, event])
        setReplyMessage(null)
        setMessage("")
    }, [setChatMessages])

    const deleteMessages = useCallback(async (onlyForMe: boolean) => {
        toggleSelectionMode(false)
        if(selectedItems.current) 
        {
            const messages = Array.from(selectedItems.current)
            await messageService.delete(messages, onlyForMe)
            selectedItems.current?.clear()

            const event_ids = Array.from(selectedItems.current).map(e => e.id) 
            setChatMessages(prev => [
                ...prev.filter(e => !event_ids.includes(e.id))
            ])
            if(!chatMessages.length) 
                removeChat(chat_id)
        }
    }, [user, selectionMode])

    return {
        message,
        setMessage,
        replyMessage,
        setReplyMessage,
        chatMessages,
        selectionMode,
        selectedItems,
        sendMessage,
        deleteMessages
    }
}

export default useMessages
