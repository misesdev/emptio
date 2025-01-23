import { selecMessageChats, selecMessages } from "@/src/services/memory/database/events"
import { User } from "@/src/services/memory/types"
import { NostrEvent } from "@/src/services/nostr/events"

const listMessages = async (chat_id: string) : Promise<NostrEvent[]> => {

    const events = await selecMessages(chat_id)

    return events.sort((a, b) => {
        return (b.created_at ?? 1) - (a.created_at ?? 1)
    })
}

const listChats = async (user: User): Promise<NostrEvent[]> => {
    
    const eventsChat = await selecMessageChats()

    eventsChat.forEach(event => { 
        if(event.pubkey == user.pubkey) {
            event.pubkey = event.tags?.filter(t => t[0] == "p").map(t => t[1])[0] 
        }
    })

    return (eventsChat as NostrEvent[]).filter(e => !!e.pubkey)
}

export const messageService = {
    listChats,
    listMessages
}
