import { deleteEventsByCondition, selecMessageChats, selecMessages 
} from "@services/memory/database/events"
import { getPairKey } from "@services/memory/pairkeys"
import { User } from "@services/memory/types"
import { getPubkeyFromTags } from "@services/nostr/events"
import { ChatUser } from "@services/zustand/chats"
import useNDKStore from "@services/zustand/ndk"
import { NDKEvent, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { nip04 } from "nostr-tools"

const listMessages = async (chat_id: string) : Promise<NDKEvent[]> => {

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

    return eventsChat.filter(c => !!c.lastMessage.pubkey).sort((a, b) => {
        return (b.lastMessage.created_at ?? 1) - (a.lastMessage.created_at ?? 1)
    })
}

const generateChatId = (event: NDKEvent): string => {
    
    var chat_id: string = ""

    const pubkeys: string[] = event?.tags?.filter(t => t[0] == "p").map(t => t[1]) ?? [""]
    
    if(pubkeys.length) {
        chat_id = pubkeys[0].substring(0, 30) + event.pubkey.substring(0, 30)
        chat_id = chat_id.match(/.{1,2}/g)?.sort().join("") ?? ""
    }
    
    return chat_id
}

const encryptMessage = async (user: User, follow: User, event: NDKEvent) : Promise<NDKEvent> => {

    const pair = await getPairKey(user.keychanges ?? "")

    event.content = await nip04.encrypt(pair.privateKey, follow.pubkey ?? "", event.content)

    return event
}

const decryptMessage = async (user: User, event: NDKEvent) : Promise<NDKEvent> => {
    
    const pair = await getPairKey(user.keychanges ?? "")

    if(pair.publicKey != event.pubkey)
        event.content = await nip04.decrypt(pair.privateKey, event.pubkey, event.content)
    else {
        const pubkey = getPubkeyFromTags(event)
        event.content = await nip04.decrypt(pair.privateKey, pubkey, event.content)
    }

    return {...event} as NDKEvent
}

type MessageProps = {
    user: User, 
    follow: User,
    message: string 
}

const sendMessage = async ({ user, follow, message }: MessageProps) : Promise<NDKEvent> => {
    
    const ndk = useNDKStore.getState().ndk

    const event = await encryptMessage(user, follow, new NDKEvent(ndk, {
        kind: 4,
        pubkey: user.pubkey ?? "",
        content: message,
        tags: [["p", follow.pubkey ?? ""]],
        created_at: Math.floor(Date.now() / 1000)
    }))
    
    event.publishReplaceable()

    return event
}

type DeleteEventProps = {
    user: User,
    event: NDKEvent,
    onlyForMe?: boolean,
}

const deleteMessage = async ({ user, event, onlyForMe = false }: DeleteEventProps) => {
    
    const ndk = useNDKStore.getState().ndk

    deleteEventsByCondition("id = ?", [event.id])

    if(!onlyForMe) 
    {
        const deleteEvent = new NDKEvent(ndk, {
            pubkey: user.pubkey ?? "",
            kind: 5,
            content: "deleting event",
            tags: [["e", event.id ?? ""]],
            created_at: Math.floor(Date.now() / 1000)
        })
        deleteEvent.publish()
    }
}

const listAnswers = async (event: NDKEvent, timeout: number = 500) :Promise<NDKEvent[]> => {

    const ndk = useNDKStore.getState().ndk

    const events = await ndk.fetchEvents({ kinds: [1], "#e": [event.id], limit: 10 }, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    return Array.from(events)
}

export const messageService = {
    listChats,
    listMessages,
    generateChatId,
    decryptMessage,
    encryptMessage,
    sendMessage,
    deleteMessage,
    listAnswers
}


