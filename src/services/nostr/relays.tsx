import { DefaultRelays } from "@src/constants/Relays"
import { getItem, setItem } from "expo-secure-store"
import { Relays } from "../memory/types"

export const getRelays = (): Relays => {
    const data = getItem("relays")
    if (data)
        return JSON.parse(data)

    return DefaultRelays
}

export const setRelays = (relays: Relays) => setItem("relays", JSON.stringify(relays))

export const insertRelay = (relay: string) => {
    const relays: Relays = [];
    const data = getItem("relays")
    if (data) {
        const relays = JSON.parse(data)
        relays.push(relay)
    } else
        relays.push(relay)

    setRelays([relay])
}

export const deleteRelay = (relay: string) => {
    const data = getItem("relays")
    if (data) {
        const relays: Relays = JSON.parse(data)
        relays.splice(relays.indexOf(relay), 1)
        setRelays(relays)
    }
}

