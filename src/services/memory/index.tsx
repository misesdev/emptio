import { setItem, getItem } from "expo-secure-store"

type User = {
    userName?: string,
    privateKey?: string,
    publicKey?: string,
    profile?: string,
    wallet?: Wallet
}

export const getUser = (): User => {
    const user = getItem("userData")
    if (user)
        return JSON.parse(user)

    return {}
}

export const insertUser = (userData: User) => setItem("userData", JSON.stringify(userData), { requireAuthentication: false }) 

type Wallet = {
    privateKey?: string,
    publicKey?: string
}

export const getWallet = (): Wallet => {
    const wallet = getItem("walletData")
    if (wallet)
        return JSON.parse(wallet)

    return {}
}

export const insertWallet = (wallet: Wallet) => setItem("walletData", JSON.stringify(wallet), { requireAuthentication: false }) 