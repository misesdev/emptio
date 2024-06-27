import { setItemAsync, getItemAsync } from "expo-secure-store"
import { PairKey } from "./types"

export const insertPairKey = async (pairKey: PairKey) => {
    var pairKeyList: PairKey[] = []

    const data = await getItemAsync("pairkeys")

    if (data) 
        pairKeyList = JSON.parse(data)

    pairKeyList.push(pairKey)

    await setItemAsync("pairkeys", JSON.stringify(pairKeyList))
}

export const getPairKey = async (key: string): Promise<PairKey> => {
    var pairKeyList: PairKey[] = []

    var pairKey: PairKey = { key: "", privateKey: "", publicKey: "" }

    const data = await getItemAsync("pairkeys")

    if (data) {
        pairKeyList = JSON.parse(data)

        let filtered = pairKeyList.filter(k => k.key == key)

        if (filtered.length)
            pairKey = filtered[0]
    }

    return pairKey
}

export const deletePairKey = async (key: string) => {
    var pairKeyList: PairKey[] = []
    var pairKey: PairKey = { key: "", privateKey: "", publicKey: "" }

    const data = await getItemAsync("pairkeys")

    if (data) {
        pairKeyList = JSON.parse(data)

        let filtered = pairKeyList.filter(k => k.key == key)

        if (filtered.length)
            pairKey = filtered[0]

        pairKeyList.splice(pairKeyList.indexOf(pairKey), 1)

        await setItemAsync("pairkeys", JSON.stringify(pairKeyList))
    }
}
