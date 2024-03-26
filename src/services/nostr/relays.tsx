import { DefaultRelays } from "@src/constants/Relays"
import { getItem, setItem } from "expo-secure-store"

export const getRelays = async (): Promise<string[]> => {

    var relays = DefaultRelays

    const data = getItem("relays")

    if (data)
        relays = JSON.parse(data)

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

