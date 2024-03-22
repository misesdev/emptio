import { getItem, setItem } from "expo-secure-store"

type Relays = string[]

export const getRelays = (): Relays => {
    const data = getItem("relays")
    if (data)
        return JSON.parse(data)

    return []
}

export const setRelays = (relays: Relays) => setItem("relays", JSON.stringify(relays))

export const addRelay = (relay: string) => {
    const relays: Relays = [];
    const data = getItem("relays")
    if(data) {
        const relays = JSON.parse(data)
        relays.push(relay)
    } else 
        relays.push(relay)        
    
    setItem("relays", JSON.stringify([relay]))
}

export const removeRelay =(relay: string) => {
    const data = getItem("relays")
    if(data) {
        const relays: Relays = JSON.parse(data)
        relays.splice(relays.indexOf(relay), 1)
        setItem("relays", JSON.stringify([relay]))
    }
}