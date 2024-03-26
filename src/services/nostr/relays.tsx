import { DefaultRelays } from "@src/constants/Relays"
import { getItem, setItem } from "expo-secure-store"
import { Relay } from "nostr-tools"

export const getRelays = async (): Promise<Relay[]> => {

    var relayList = DefaultRelays

    const relays: Relay[] = []

    const data = getItem("relays")

    if (data)
        relayList = JSON.parse(data)

    relayList.forEach(async relay => { 
        const relayConnected = await Relay.connect(relay)

        relays.push(relayConnected)
    })

    return relays
}

export const setRelays = (relays: string[]) => setItem("relays", JSON.stringify(relays))

export const insertRelay = (relay: string) => {
    const relays: string[] = [];
    const data = getItem("relays")
    if (data) {
        const relays = JSON.parse(data)
        relays.push(relay)
    } else
        relays.push(relay)

    setRelays(relays)
}

export const deleteRelay = (relay: string) => {
    const data = getItem("relays")
    if (data) {
        const relays: string[] = JSON.parse(data)
        relays.splice(relays.indexOf(relay), 1)
        setRelays(relays)
    }
}

