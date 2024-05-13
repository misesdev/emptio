import { DefaultRelays } from "@src/constants/Relays"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const getRelays = async (): Promise<string[]> => {

    var relays = DefaultRelays

    const data = await AsyncStorage.getItem("relays")

    if (data)
        relays = JSON.parse(data)
    else 
        await setRelays(relays)
 
    return relays
}

export const setRelays = async (relays: string[]) => await AsyncStorage.setItem("relays", JSON.stringify(relays))

export const insertRelay = async (relay: string) => {
    let relays = await getRelays()
    if (relays) {
        relays.push(relay)
    } else
        relays = [relay]

    setRelays(relays)
}

export const deleteRelay = async (relay: string) => {
    let relays = await getRelays()
    if (relays) {
        relays.splice(relays.indexOf(relay), 1)
        setRelays(relays)
    }
}

