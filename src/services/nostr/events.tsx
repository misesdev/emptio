import { Event, Relay, Filter, NostrEvent, SimplePool } from "nostr-tools"
import { getRelays } from "./relays"
import { Events } from "@src/constants/Events"


export const publishEvent = async (event: Event) => {

    const pool = new SimplePool()

    const relays = await getRelays()

    let h = pool.subscribeMany(relays,
    [
        {
            authors: [event.pubkey],
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

    await Promise.any(pool.publish(relays, event))
}

export const getNostrEvents = async (filter: Filter, pubkey: string): Promise<NostrEvent[]> => {

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


