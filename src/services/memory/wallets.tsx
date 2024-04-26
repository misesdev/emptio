import AsyncStorage from "@react-native-async-storage/async-storage"
import { Wallet } from "./types"
import { useTranslate } from "../translate"

export const getWallets = async (): Promise<Wallet[]> => {

    var wallets: Wallet[] = []

    const data = await AsyncStorage.getItem("walletsData")

    if (data)
        wallets = JSON.parse(data)

    return wallets
}

export const getWallet = async (key: string): Promise<Wallet> => {

    const wallets = await getWallets()

    const walletFiltered = wallets.filter(x => x.key === key)

    if (walletFiltered.length <= 0)
        throw new Error(useTranslate("message.wallet.notfound"))

    return walletFiltered[0]
}

export const insertWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    wallet.id = wallets.length + 1

    wallets.push(wallet)

    await AsyncStorage.setItem("walletsData", JSON.stringify(wallets))
}

export const updateWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    const findWallet = wallets.filter(w => w.key == wallet.key)[0]

    const index = wallets.indexOf(findWallet)

    if (index <= -1)
        throw new Error(useTranslate("message.wallet.notfound"))

    wallets[index].name = wallet.name
    wallets[index].lastBalance = wallet.lastBalance
    wallets[index].lastReceived = wallet.lastReceived
    wallets[index].lastSended = wallet.lastSended
    wallets[index].address = wallet.address

    await AsyncStorage.setItem("walletsData", JSON.stringify(wallets))
}

export const deleteWallet = async (key: string) => {

    const wallets = await getWallets()

    const wallet = await getWallet(key)

    wallets.splice(wallets.indexOf(wallet), 1)

    await AsyncStorage.setItem("walletsData", JSON.stringify(wallets))
}

export const deleteWallets = async () => await AsyncStorage.removeItem("walletsData")