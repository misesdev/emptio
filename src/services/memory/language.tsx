import { getItem, getItemAsync, setItemAsync } from "expo-secure-store"
import { Language } from "../translate/types"
import { HexPairKeys, User } from "./types"

const pairKeys: HexPairKeys = { privateKey: "", publicKey: "" }

export const getPairKeys = async () => {

    const userData = await getItemAsync("userData")

    if (userData) {
        const user: User = JSON.parse(userData)
        pairKeys.privateKey = user.privateKey ? user.privateKey : pairKeys.privateKey
        pairKeys.publicKey = user.publicKey ? user.publicKey : pairKeys.publicKey
    }

    return pairKeys
}

export const setLanguage = async (language: string) => await setItemAsync("language", language)

export const getLanguage = (): Language => {

    const language = getItem("language")
    
    switch (language) {
        case "pt":
            return language
        case "en":
            return language
        default:
            return "en"
    }
}