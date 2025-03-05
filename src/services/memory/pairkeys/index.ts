import EncryptedStorage from "react-native-encrypted-storage"
import { PairKey } from "../types"

export const getPairKeys = async () : Promise<PairKey[]> => {
    
    const data = await EncryptedStorage.getItem("pairkeys")

    if (data) {
        var pairkeys = JSON.parse(data) as PairKey[]

        return pairkeys
    }
    return []
} 

export const insertPairKey = async (pairKey: PairKey) => {
    
    const pairkeys = await getPairKeys()

    pairkeys.push(pairKey)

    await EncryptedStorage.setItem("pairkeys", JSON.stringify(pairkeys))
}

export const getPairKey = async (key: string): Promise<PairKey> => {

    const pairkeys = await getPairKeys()

    const pairkey = pairkeys.find(x => x.key == key)

    if(!pairkey) throw Error("Pairkey not found!")

    return pairkey
}

export const deletePairKey = async (key: string) => {
    
    const pairkeys = await getPairKeys()

    let filtered = pairkeys.filter(k => k.key != key)

    await EncryptedStorage.setItem("pairkeys", JSON.stringify(filtered))
}
