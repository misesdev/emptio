import { selecMessageChats, selecMessages } from "@/src/services/memory/database/events"
import { User } from "@/src/services/memory/types"
import { NostrEvent } from "@/src/services/nostr/events"
import { ChatUser } from "@/src/services/zustand/chats"
import { NDKEvent } from "@nostr-dev-kit/ndk"

const listMessages = async (chat_id: string) : Promise<NostrEvent[]> => {

    const events = await selecMessages(chat_id)

    return events.sort((a, b) => {
        return (b.created_at ?? 1) - (a.created_at ?? 1)
    })
}

const listChats = async (user: User): Promise<ChatUser[]> => {
    
    const eventsChat = await selecMessageChats()

    eventsChat.forEach(chat => { 
        if(chat.lastMessage.pubkey == user.pubkey) {
            chat.lastMessage.pubkey = chat.lastMessage.tags?.filter(t => t[0] == "p").map(t => t[1])[0] 
        }
    })

    return eventsChat.filter(c => !!c.lastMessage.pubkey)
}

const generateChatId = (event: NDKEvent): string => {
    
    var chat_id: string = ""

    const pubkeys: string[] = event?.tags?.filter(t => t[0] == "p").map(t => t[1]) ?? [""]
    
    if(pubkeys.length) {
        chat_id = pubkeys[0].substring(0, 30) + event.pubkey.substring(0, 30)
        chat_id = chat_id.split("").sort().join("")
    }
    
    return chat_id
}

export const messageService = {
    listChats,
    listMessages,
    generateChatId
}
