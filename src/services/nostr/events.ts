
import { NDKUserProfile, NDKEvent, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { Filter } from "nostr-tools"
import { PairKey, User } from "../memory/types"
import { jsonContentKinds } from "@src/constants/Events"
import useNDKStore from "../zustand/ndk"

export interface NostrEvent {
    id?: string,
    kind?: number,
    pubkey?: string,
    content?: string | User,
    created_at?: number,
    tags?: string[][],
    sig?: string,
    status?: "new" | "viewed",
    chat_id?: string
}

export const publishUser = async (profile: NDKUserProfile, keys: PairKey) => {

    const ndk = useNDKStore.getState().ndk

    const user = ndk.getUser({ hexpubkey: keys.publicKey })

    await user.fetchProfile()

    user.profile = profile

    await user.publish()
}

export const publishEvent = async (event: NostrEvent, keys: PairKey, replacable: boolean = false) => {

    const ndk = useNDKStore.getState().ndk
    
    const eventSend = new NDKEvent(ndk);

    eventSend.kind = event.kind
    eventSend.pubkey = event.pubkey ?? ""
    eventSend.content = typeof(event.content) == "string" ? event.content : JSON.stringify(event.content)
    eventSend.created_at = event.created_at
    eventSend.tags = event.tags ?? [[]]

    await eventSend.sign()

    if(replacable) await eventSend.publishReplaceable()
    
    if(!replacable) await eventSend.publish()
}

export const listenerEvents = async (filters: Filter) : Promise<NostrEvent[]> => {

    const ndk = useNDKStore.getState().ndk

    const events = await ndk.fetchEvents(filters, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    return Array.from(events).map((event) : NostrEvent => {
        let jsonContent = jsonContentKinds.includes(event.kind ?? 0)
        return {
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: jsonContent ? JSON.parse(event.content) : event.content,
            created_at: event.created_at,
            tags: event.tags
        } 
    })
}

export const getEvent = async (filters: Filter) : Promise<NostrEvent> => {

    var eventResut: NostrEvent = {}

    const ndk = useNDKStore.getState().ndk

    const event = await ndk.fetchEvent(filters, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    if (event) {
        let jsonContent = jsonContentKinds.includes(event.kind ?? 0)
        
        eventResut = {
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: jsonContent ? JSON.parse(event.content) : event.content,
            created_at: event.created_at,
            tags: event.tags
        }

        return eventResut 
    }

    throw new Error("event not found")
}

export const getPubkeyFromTags = (event: NDKEvent) : string => {

    const pubkeys = event.tags.filter(t => t[0] == "p").map(t => t[1])

    if(pubkeys.length)
        return pubkeys[0]

    throw new Error("the event does not have a pubkey in its tags")
}


