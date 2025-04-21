import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { User } from "../memory/types"
import { messageService } from "@services/message"
import { getPubkeyFromTags } from "./events"
import useOrderStore from "../zustand/orders"
import useChatStore from "../zustand/chats"
import { SellOrder, UserReputation } from "../types/order"
import { timeSeconds } from "../converter"
import { DBEvents, dbEventProps } from "../memory/database/events"
import useDataEventStore from "../zustand/dataEvents"
import { EventKinds } from "@/src/constants/Events"

var batchTimer: NodeJS.Timeout|null = null
var enqueueEvents: dbEventProps[] = []

const processEventsInBatch = async (notify: (dbEvent: dbEventProps) => void) => {
    if(enqueueEvents.length <= 0) return

    const batch = [...enqueueEvents]
    enqueueEvents.length = 0

    const withSuccess = await DBEvents.insertInBatch(batch)
   
    withSuccess.forEach(notify) 
}

interface ProcessEventProps {
    user: User, 
    event: NDKEvent 
}

export const processEventMessage = async ({ user, event }: ProcessEventProps) => { 
    try {
        const store = useChatStore.getState()
        
        const chat_id = messageService.generateChatId(event)

        enqueueEvents.push({ chat_id, event, category: "message" })

        if(!batchTimer) 
        {
            batchTimer = setTimeout(async() => {
                await processEventsInBatch(dbEvent => {
                    const lastMessage = {...dbEvent.event} as NDKEvent
                    if(lastMessage.pubkey == user.pubkey)
                        lastMessage.pubkey = getPubkeyFromTags(dbEvent.event) ?? lastMessage.pubkey
                    store.addChat({ chat_id: dbEvent.chat_id??"", lastMessage })
                })
                batchTimer = null
            }, 100)
        }
    } catch { }
}

export const processEventOrders = ({ user, event } :ProcessEventProps) => {
    try { 
        const store = useOrderStore.getState()
        const data = JSON.parse(event.content)

        if(event.pubkey == user.pubkey) 
            store.setEvent(event)
        
        // handling sell orders
        if(event.tags.some(t => t[0] == "o" && t[1] == "orders")) {
            let orders = data.orders as SellOrder[]
            orders.forEach(order => {
                if(order.closure > timeSeconds.now()) {
                    order.author = event.pubkey
                    store.addOrder(order)
                }
            })
        }

        // handling reputation mentions
        if(event.tags.some(t => t[0] == "o" && t[1] == "reputations")) {
            let reputations = data.reputations as UserReputation[]
            reputations.forEach(reputation => {
                reputation.author = event.pubkey
                store.addReputation(reputation)
            })
        }
    } 
    catch {}
}

export const processDataEvents = (event: NDKEvent)  => {
    
    const store = useDataEventStore.getState()

    switch(event.kind) {
        case EventKinds.metadata:
            store.addEventData("metadata", event as NostrEvent)
        case EventKinds.followList:
            store.addEventData("follows", event as NostrEvent)
        case 10002:
            store.addEventData("orders", event as NostrEvent)
    }
}
