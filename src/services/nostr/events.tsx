
import NDK, { NDKUserProfile, NDKPrivateKeySigner, NDKEvent } from "@nostr-dev-kit/ndk"
import { Filter } from "nostr-tools"
import { PairKey, User } from "../memory/types"
import { getRelays } from "../memory/relays"
import { NostrEventKinds } from "@/src/constants/Events"

export type NostrEvent = {
    id?: string,
    kind?: number,
    pubkey?: string,
    content?: any,
    created_at?: number,
    tags?: string[][]
}

export const publishUser = async (profile: NDKUserProfile, keys: PairKey) => {

    const pool = Nostr as NDK

    pool.signer = new NDKPrivateKeySigner(keys.privateKey)

    const user = pool.getUser({ hexpubkey: keys.publicKey })

    await user.fetchProfile()

    user.profile = profile

    await user.publish()
}

export const publishEvent = async (event: NostrEvent, keys: PairKey, replacable: boolean = false) => {

    const pool = Nostr as NDK
    
    pool.signer = new NDKPrivateKeySigner(keys.privateKey)

    const eventSend = new NDKEvent(pool);

    eventSend.kind = event.kind
    eventSend.pubkey = event.pubkey ?? ""
    eventSend.content = event.content
    eventSend.created_at = event.created_at
    eventSend.tags = event.tags ?? [[]]

    await eventSend.sign()

    if(replacable) await eventSend.publishReplaceable()
    
    if(!replacable) await eventSend.publish()
}

export const listenerEvents = async (filters: Filter) : Promise<NostrEvent[]> => {

    const pool = Nostr as NDK

    const events = await pool.fetchEvents(filters)

    const eventsResut: NostrEvent[] = []

    events.forEach((event: NDKEvent) => {

        let jsonContent = [NostrEventKinds.metadata].includes(event.kind ?? 0)

        eventsResut.push({
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: jsonContent ? JSON.parse(event.content) : event.content,
            created_at: event.created_at,
            tags: event.tags
        })
    })

    return eventsResut
}

export const getEvent = async (filters: Filter) : Promise<NostrEvent> => {

    var eventResut: NostrEvent

    const pool = Nostr as NDK

    const event = await pool.fetchEvent(filters)

    if (event) {
        let jsonContent = [NostrEventKinds.metadata].includes(event.kind ?? 0)

        eventResut = {
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: jsonContent ? JSON.parse(event.content) : event.content,
            created_at: event.created_at,
            tags: event.tags
        }

        return eventResut as NostrEvent
    } else 
        return {}
}


