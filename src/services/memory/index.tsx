import { setItem, getItem } from "expo-secure-store";

type User = {
    firstName?: string,
    lastName?: string,
    profile?: string,
    privateKey?: string,
    publicKey?: string
}

export const getUser = ():  User => {
    const user = getItem("userData")
    if(user)
        return JSON.parse(user)

    return {}
}

export const setUser = (userData: User) =>  setItem("userData", JSON.stringify(userData))


type Wallet = {
    privateKey?: string,
    publicKey?: string
}

export const getWallet = (): Wallet => {
    const wallet = getItem("walletData")
    if(wallet)
        return JSON.parse(wallet)

    return {}
}

export const setWallet = (wallet: Wallet) => setItem("walletData", JSON.stringify(wallet))