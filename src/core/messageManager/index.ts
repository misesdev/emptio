import { deleteEventsByCondition, selecMessageChats, selecMessages } from "@/src/services/memory/database/events"
import { getPairKey } from "@/src/services/memory/pairkeys"
import { User } from "@/src/services/memory/types"
import { getPubkeyFromTags } from "@/src/services/nostr/events"
import { ChatUser } from "@/src/services/zustand/chats"
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk"
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

    return event
}

type MessageProps = {
    user: User, 
    follow: User,
    message: string 
}

const sendMessage = async ({ user, follow, message }: MessageProps) : Promise<NDKEvent> => {
    const pool = Nostr as NDK

    const event = await encryptMessage(user, follow, new NDKEvent(pool, {
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
    
    const pool = Nostr as NDK

    deleteEventsByCondition("id = ?", [event.id])

    if(!onlyForMe) 
    {
        const deleteEvent = new NDKEvent(pool, {
            pubkey: user.pubkey ?? "",
            kind: 5,
            content: "deleting event",
            tags: [["e", event.id ?? ""]],
            created_at: Math.floor(Date.now() / 1000)
        })
        deleteEvent.publish()
    }
}

export const messageService = {
    listChats,
    listMessages,
    generateChatId,
    decryptMessage,
    encryptMessage,
    sendMessage,
    deleteMessage
}


