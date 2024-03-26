
import { Event, Filter, SimplePool } from "nostr-tools"
import { getRelays } from "./relays"

import NDK, { NDKUserProfile, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk"
import { HexPairKeys } from "../memory/types"

export const getConnection = async (privateKey?: string): Promise<NDK> => {
    const relays = await getRelays()

    const ndk = new NDK({
        explicitRelayUrls: relays,
        signer: new NDKPrivateKeySigner(privateKey)
    })

    await ndk.connect()

    return ndk
}

export const publishUser = async (profile: NDKUserProfile, keys: HexPairKeys) => {
    
    const client = await getConnection(keys.privateKey)

    const user = client.getUser({ hexpubkey: keys.publicKey })

    await user.fetchProfile()

    user.profile = profile

    console.log("publishing")

    await user.publish()
}

// export const publishEvent = async (event: Event, secretKey: string) => {

//     const relays = await getRelays()

//     const ndk = new NDK({ explicitRelayUrls: relays, signer: secretKey })

//     const eventSend = new NDKEvent(ndk);

//     eventSend.content = event.content
//     eventSend.kind = event.kind   
    
//     await eventSend.publish()
// }

export const getNostrEvents = async (filter: Filter, pubkey: string) => {

    const pool = new SimplePool()

    const relays = await getRelays()

    let h = pool.subscribeMany(relays,
        [
            {
                authors: [pubkey],
            },
        ],
        {
            onevent(event) {
                // this will only be called once the first time the event is received
                // ...
            },
            oneose() {
                h.close()
            }
        })

    return pool.querySync(relays, filter)
}

export const listenerEvents = async (filters: Filter) => {

    const client = await getConnection()

    const events = await client.fetchEvents(filters)

    const eventsResut: {
        kind: number,
        pubkey: string,
        content: string
    }[] = []

    events.forEach(event => eventsResut.push({
        kind: 0,
        pubkey: event.pubkey,
        content: event.content
    }))

    return eventsResut
}

export const getEvent = async (filters: Filter) => {

    const client = await getConnection()

    const event = await client.fetchEvent(filters)

    const eventsResut: {
        kind: number,
        pubkey: string,
        content: string
    } = {
        kind: event?.kind ? event?.kind : 0,
        pubkey: event?.pubkey ? event?.pubkey : "",
        content: event?.content ? event?.content : ""
    }

    return eventsResut
}

export const sendEvent = async (event: Event) => {
    const client = await getConnection()

    // client.publish()
}

