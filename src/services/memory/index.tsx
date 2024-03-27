import { setItem, getItem, getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store"
import { Language } from "../translate/types"
import { HexPairKeys, User, Wallet } from "./types"

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

export const getUser = async (): Promise<User> => {
    const user = await getItemAsync("userData")
    if (user)
        return JSON.parse(user)

    return { privateKey: "", publicKey: "" }
}

export const insertUser = async (userData: User) => await setItemAsync("userData", JSON.stringify(userData))

export const deleteUser = async () => await deleteItemAsync("userData")

export const getWallet = async(): Promise<Wallet> => {
    const wallet = await getItemAsync("walletData")
    if (wallet)
        return JSON.parse(wallet)

    return {}
}

export const insertWallet = async (wallet: Wallet) => await setItemAsync("walletData", JSON.stringify(wallet))

export const deleteWallet = async () => await deleteItemAsync("walletData")

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

export const clearStorage = async () => {
    await deleteItemAsync("userData")
    await deleteItemAsync("walletData")
    await deleteItemAsync("language")
    await deleteItemAsync("relays")
}