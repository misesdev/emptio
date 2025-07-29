import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { DataBaseEvents, DBEventProps } from "@storage/database/DataBaseEvents"
import useChatStore, { ChatStore } from "../zustand/useChatStore";
import { ChatUtilities } from "@src/utils/ChatUtilities";
import { Utilities } from "@src/utils/Utilities";
import useOrderStore, { OrderStore } from "../zustand/useOrderStore";
import { EventKinds } from "@/src/constants/Events";
import useDataEventStore, { DataEventStore } from "../zustand/useDataEventStore";
import { SellOrder } from "../order/types/SellOrder";
import { TimeSeconds } from "../converter/TimeSeconds";
import { UserReputation } from "../user/types/UserReputation";
import { User } from "../user/types/User";

export type EventProps = {
    user: User, event: NDKEvent
}

export class NostrEventHandler
{
    private readonly _chatStore: ChatStore; 
    private readonly _orderStore: OrderStore;
    private readonly _dataStore: DataEventStore;
    private readonly _dbEvents: DataBaseEvents;
    private _batchTimer: NodeJS.Timeout|null = null
    private _enqueueEvents: DBEventProps[] = []
    public kindsDataEvents: number[] = [
        EventKinds.metadata,      // user profile data
        EventKinds.followList,    // user pubkey follows list
        EventKinds.relayList,     // user relay list with orders and reputation
        EventKinds.chatRelayList, // user relay list from chat events
    ]
    constructor(
        chatStore: ChatStore = useChatStore.getState(),
        orderStore: OrderStore = useOrderStore.getState(),
        dataStore: DataEventStore = useDataEventStore.getState(),
        dbEvents: DataBaseEvents = new DataBaseEvents()
    ) {
        this._dbEvents = dbEvents
        this._chatStore = chatStore
        this._orderStore = orderStore
        this._dataStore = dataStore
    }

    public async handleEvent({ user, event }: EventProps) 
    {
        if([4, 7].includes(event.kind??1)) 
        {
            await this.handleMessageEvent({ user, event })
        }
        if(this.kindsDataEvents.includes(event.kind??0))    
        {
            await this.handleDataEvent({ user, event })
        }
        if(event.kind == EventKinds.relayList) 
        {
            await this.handleOrderEvent({ user, event })
        }
    }

    public async handleOrderEvent({ user, event }: EventProps)
    {
        event.removeAllListeners()
        try { 
            const data = JSON.parse(event.content)
            if(event.pubkey == user.pubkey) 
                this._orderStore.setEvent(event)
            // handling sell orders
            if(event.tags.some(t => t[0] == "o" && t[1] == "orders")) {
                let orders = data.orders as SellOrder[]
                orders.forEach(order => {
                    if(order.closure > TimeSeconds.now()) {
                        order.author = event.pubkey
                        this._orderStore.addOrder(order)
                    }
                })
            }
            // handling reputation mentions
            if(event.tags.some(t => t[0] == "o" && t[1] == "reputations")) {
                let reputations = data.reputations as UserReputation[]
                reputations.forEach(reputation => {
                    reputation.author = event.pubkey
                    this._orderStore.addReputation(reputation)
                })
            }
        } 
        catch { }
    }

    public async handleDataEvent({ event }: EventProps)
    {
        event.removeAllListeners()
        if(event.kind == EventKinds.metadata) 
            this._dataStore.addEventData("metadata", event)
        if(event.kind == EventKinds.followList)
            this._dataStore.addEventData("follows", event)
        if(event.kind == EventKinds.relayList)
            this._dataStore.addEventData("orders", event)
        if(event.kind == EventKinds.chatRelayList)
            this._dataStore.addEventData("chat-relays", event)
    }
    
    public async handleMessageEvent({ user, event }: EventProps)
    {
        event.removeAllListeners()
        const chat_id = ChatUtilities.chatIdFromEvent(event)
        this._enqueueEvents.push({ chat_id, event, category: "message" })
        if(!this._batchTimer) 
        {
            this._batchTimer = setTimeout(async() => {
                await this.insertInBatch(dbEvent => {
                    const lastMessage = {...dbEvent.event} as NDKEvent
                    if(lastMessage.pubkey === user.pubkey)
                        lastMessage.pubkey = Utilities.pubkeyFromTags(dbEvent.event)[0]
                    this._chatStore.addChat({ chat_id: dbEvent.chat_id??"", lastMessage })
                })
                this._batchTimer = null
            }, 100)
        }
    }

    public async insertInBatch(notify: (dbEvent: DBEventProps) => void) 
    {
        if(this._enqueueEvents.length <= 0) return

        const batch = [...this._enqueueEvents]
        this._enqueueEvents.length = 0

        const withSuccess = await this._dbEvents.insertInBatch(batch)
       
        withSuccess.forEach(notify) 
    } 
    
}
