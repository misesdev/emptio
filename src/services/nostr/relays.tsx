import { DefaultRelays } from "@src/constants/Relays"
import { getItemAsync, setItemAsync } from "expo-secure-store"

export const getRelays = async (): Promise<string[]> => {

    var relays = DefaultRelays

    const data = await getItemAsync("relays")

    if (data)
        relays = JSON.parse(data)

    return relays
}

export const setRelays = async (relays: string[]) => await setItemAsync("relays", JSON.stringify(relays))

export const insertRelay = async (relay: string) => {
    const relays: string[] = [];
    const data = await getItemAsync("relays")
    if (data) {
        const relays = JSON.parse(data)
        relays.push(relay)
    } else
        relays.push(relay)

    setRelays(relays)
}

export const deleteRelay = async (relay: string) => {
    const data = await getItemAsync("relays")
    if (data) {
        const relays: string[] = JSON.parse(data)
        relays.splice(relays.indexOf(relay), 1)
        setRelays(relays)
    }
}

