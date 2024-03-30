import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store"
import { Wallet } from "./types"

export const getWallets = async (): Promise<Wallet[]> => {

    var wallets: Wallet[] = []

    const data = await getItemAsync("walletsData")

    if (data)
        wallets = JSON.parse(data)

    return wallets
}

export const insertWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    wallet.id = wallets.length + 1

    wallets.push(wallet)

    await setItemAsync("walletsData", JSON.stringify(wallets))
}

export const updateWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    const index = wallets.indexOf(wallet)

    if (index <= -1)
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

export const deleteWallets = async () => await deleteItemAsync("walletsData")