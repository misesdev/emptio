import { setItem, getItem } from "expo-secure-store"
import { Language } from "../translate/types"
import { User, Wallet } from "./types"

export const getUser = (): User => {
    const user = getItem("userData", { requireAuthentication: false })
    if (user)
        return JSON.parse(user)

    return {}
}

export const insertUser = (userData: User) => setItem("userData", JSON.stringify(userData), { requireAuthentication: false })

export const deleteUser = () => setItem("userData", "", { requireAuthentication: false })

export const getWallet = (): Wallet => {
    const wallet = getItem("walletData", { requireAuthentication: false })
    if (wallet)
        return JSON.parse(wallet)

    return {}
}

export const insertWallet = (wallet: Wallet) => setItem("walletData", JSON.stringify(wallet), { requireAuthentication: false })

export const deleteWallet = () => setItem("walletData", "", { requireAuthentication: false })

export const setLanguage = (language: string) => setItem("language", language, { requireAuthentication: false })

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

export const clearStorage = () => {
    setItem("userData", "")
    setItem("walletData", "")
    setItem("language", "")
    setItem("relays", "")
}