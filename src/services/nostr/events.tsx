import { Event, Relay, Filter, NostrEvent } from "nostr-tools"
import { getRelays } from "./relays"
import { Events } from "@src/constants/Events"

export const publishEvent = async (event: Event) => {

    var returned = false

    const relays = await getRelays()

    return await new Promise((resolve) => {

        relays.forEach(async relay => {
            if (!relay.publish)
                return

            const result = await relay.publish(event)

            switch (result) {
                case "ok":
                    if (!returned) {
                        resolve(event)
                        returned = true
                    }
                    console.log(`${relay.url} has accepted our event`)
                case "seen":
                    console.log(`we saw the event on ${relay.url}`)
                case "filed":
                    console.log(`failed to publish to ${relay.url}`)
                default:
                    console.log(`${relay.url} returned ${result}`)
            }
        })

        setTimeout(() => {
            if (!returned) {
                resolve(undefined)
                returned = true
            }
        }, Events.TimeOut)

    })
}

export const getNostrEvents = async (relays: Relay[], filter: Filter): Promise<NostrEvent[]> => {

    return await new Promise((resolve) => {
        const limit = filter?.limit || Events.MaxListener
        const eventsById: Record<string, NostrEvent> = {}
        let fetchedCount = 0
        let returned = false

        relays.forEach((relay) => {
            if (!relay.subscribe) {
                return
            }

            const sub = relay.subscribe([filter], {})

            sub.onevent(event => {

                const nostrEvent: Event = event

                // ts-expect-error
                eventsById[nostrEvent.id] = nostrEvent

                fetchedCount++

                if (fetchedCount >= limit) {
                    resolve(Array.from(Object.values(eventsById)))
                    sub.close()
                    returned = true
                }
            })

            sub.oneose(() => sub.close())

            setTimeout(() => {
                // If all data was already received do nothing
                if (returned)
                    return

                // If a timeout happens, return what has been received so far
                sub.close()
                returned = true

                resolve(Array.from(Object.values(eventsById)))
            }, Events.TimeOut)
        })
    })
}


