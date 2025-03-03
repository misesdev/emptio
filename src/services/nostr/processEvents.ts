import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { dbEventProps, insertEventsInBatch } from "../memory/database/events"
import { User } from "../memory/types"
import { ChatUser } from "../zustand/chats"
import { messageService } from "@services/message"
import { getPubkeyFromTags } from "./events"

var batchTimer: NodeJS.Timeout|null = null
var enqueueEvents: dbEventProps[] = []

const processEventsInBatch = async (notify: (dbEvent: dbEventProps) => void) => {
    if(enqueueEvents.length <= 0) return

    const batch = [...enqueueEvents]
    enqueueEvents.length = 0

    const withSuccess = await insertEventsInBatch(batch)
   
    withSuccess.forEach(notify) 
}

type addChatProps = { user: User, event: NDKEvent, addChat: (chat: ChatUser) => void }

export const processEventMessage = async ({ user, event, addChat }: addChatProps) => { 
    try {
        const chat_id = messageService.generateChatId(event)

        enqueueEvents.push({ chat_id, event, category: "message" })

        if(!batchTimer) 
        {
            batchTimer = setTimeout(async() => {
                await processEventsInBatch(dbEvent => {
                    const lastMessage = {...dbEvent.event} as NDKEvent
                    if(lastMessage.pubkey == user.pubkey)
                        lastMessage.pubkey = getPubkeyFromTags(dbEvent.event)
                    addChat({ chat_id: dbEvent.chat_id??"", lastMessage })
                })
                batchTimer = null
            }, 100)
        }
    
        // if(["inactive", "background"].includes(AppState.currentState))
        // {
        //     await event.decrypt() 
        //     const profile = await event.author.fetchProfile()
        //     await pushNotification({ 
        //         title: profile?.displayName ?? profile?.name ?? "",
        //         message: event.content.length <= 30 ? event.content : `${event.content.substring(0,30)}..`
        //     })
        // }
    
    } catch { }
}
