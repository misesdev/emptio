import { DBEvents } from "@services/memory/database/events"
import { User } from "@services/memory/types"
import { getPubkeyFromTags } from "@services/nostr/events"
import { ChatUser } from "@services/zustand/chats"
import useNDKStore from "@services/zustand/ndk"
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk-mobile"
import { nip04 } from "nostr-tools"
import { timeSeconds } from "@services/converter"
import { storageService } from "../memory"

const listMessages = async (chat_id: string) : Promise<NDKEvent[]> => {

    const events = await DBEvents.selecMessages(chat_id)

    return events.sort((a, b) => {
        return (b.created_at ?? 1) - (a.created_at ?? 1)
    })
}

const listChats = async (user: User): Promise<ChatUser[]> => {
    
    const eventsChat = await DBEvents.selecChats()

    eventsChat.forEach(chat => { 
        if(chat.lastMessage.pubkey == user.pubkey) {
            chat.lastMessage.pubkey = chat.lastMessage.tags?.filter(t => t[0] == "p").map(t => t[1])[0] 
        }
    })

    return eventsChat.filter(c => !!c.lastMessage.pubkey).sort((a, b) => {
        return (b.lastMessage.created_at ?? 1) - (a.lastMessage.created_at ?? 1)
    })
}

const deleteChats = async (chat_ids: string[]) => {
    await DBEvents.deleteByCondition(`chat_id in ('${chat_ids.join("','")}')`, [])
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

    const pair = await storageService.pairkeys.get(user.keychanges ?? "")

    event.content = await nip04.encrypt(pair.privateKey, follow.pubkey ?? "", event.content)

    return event
}

const decryptMessage = async (user: User, event: NDKEvent) : Promise<NDKEvent> => {
    
    const pair = await storageService.pairkeys.get(user.keychanges ?? "")

    if(pair.publicKey != event.pubkey)
        event.content = await nip04.decrypt(pair.privateKey, event.pubkey, event.content)
    else {
        const pubkey = getPubkeyFromTags(event)
        event.content = await nip04.decrypt(pair.privateKey, pubkey, event.content)
    }

    await DBEvents.updateContent(event)

    return {...event} as NDKEvent
}

interface MessageProps {
    user: User, 
    follow: User,
    message: string,
    forward?: boolean
}

const sendMessage = async (props: NDKEvent | MessageProps) : Promise<NDKEvent> => {
   
    var event: NDKEvent = { } as NDKEvent
    const ndk = useNDKStore.getState().ndk

    if((props as MessageProps).message) {
        const { user, follow, message, forward } = props as MessageProps

        const tags: NDKTag[] = [["p", follow.pubkey ?? ""]]
        if(forward) tags.push(["f", "forward"])

        event = await encryptMessage(user, follow, new NDKEvent(ndk, {
            kind: 4,
            pubkey: user.pubkey ?? "",
            content: message,
            tags: tags,
            created_at: timeSeconds.now() 
        }))     
    }
    
    if((props as NDKEvent).pubkey)
        event = props as NDKEvent
    
    event?.publishReplaceable()

    return event
}

type DeleteEventProps = {
    user: User,
    event: NDKEvent,
    onlyForMe?: boolean
}

const deleteMessage = async ({ user, event, onlyForMe = false }: DeleteEventProps) => {
    
    const ndk = useNDKStore.getState().ndk

    await DBEvents.deleteByCondition("id = ?", [event.id])

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

type DeleteEventsProps = {
    user: User,
    events: NDKEvent[],
    onlyForMe?: boolean,
}

const deleteMessages = async ({ user, events, onlyForMe = false }: DeleteEventsProps) => {
    
    const promises: Promise<void>[] = []
    const ndk = useNDKStore.getState().ndk

    const event_ids = `('${events.map(e => e.id).join("','")}')`
    await DBEvents.deleteByCondition(`id IN ${event_ids}`, [])

    if(!onlyForMe) 
    {
        events.filter(e => e.pubkey == user.pubkey).forEach(event => {
            promises.push(new Promise<void>(async (resolve) => {
                try {
                    const deleteEvent = new NDKEvent(ndk, {
                        kind: 5,
                        pubkey: user.pubkey ?? "",
                        content: "deleting event",
                        tags: [["e", event.id ?? ""]],
                        created_at: timeSeconds.now()
                    })
                    await deleteEvent.publish()
                    resolve()
                } 
                catch { resolve() }
            }))
        })
    }

    Promise.all(promises)
}

export const messageService = {
    listChats,
    deleteChats,
    listMessages,
    generateChatId,
    decryptMessage,
    encryptMessage,
    sendMessage,
    deleteMessage,
    deleteMessages
}


