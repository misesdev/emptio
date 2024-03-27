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

export const getWallets = async (): Promise<Wallet[]> => {

    var wallets: Wallet[] = []

    const data = await getItemAsync("walletsData")

    if (data)
        wallets = JSON.parse(data)

    return wallets
}

export const insertWallet = async (wallet: Wallet) => {
    
    const wallets = await getWallets()

    wallets.push(wallet)

    await setItemAsync("walletsData", JSON.stringify(wallets))
}

export const updateWallet = async (wallet: Wallet) => {
    
    const wallets = await getWallets()

    const index = wallets.indexOf(wallet)

    if(index <= -1)
        throw "wallet not found in storage"

    wallets[index].name = wallet.name
    wallets[index].privateKey = wallet.privateKey
    wallets[index].publicKey = wallet.publicKey
    wallets[index].lastBalance = wallet.lastBalance
    wallets[index].address = wallet.address

    await setItemAsync("walletsData", JSON.stringify(wallets))
}

export const deleteWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    wallets.splice(wallets.indexOf(wallet), 1)

    await setItemAsync("walletsData", JSON.stringify(wallets))
}

export const deleteWallets = async () =>  await deleteItemAsync("walletsData")

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
    await deleteItemAsync("walletsData")
    await deleteItemAsync("language")
    await deleteItemAsync("relays")
}