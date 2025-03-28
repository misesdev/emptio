import AsyncStorage from "@react-native-async-storage/async-storage"
import { Wallet } from "../types"

export const getWallets = async (): Promise<Wallet[]> => {

    let wallets: Wallet[] = []

    const data = await AsyncStorage.getItem("walletsData")

    if (data)
        wallets = JSON.parse(data) as Wallet[]

    return wallets
}

export const getWallet = async (key: string): Promise<Wallet> => {

    const wallets = await getWallets()

    const walletFiltered = wallets.find(x => x.key === key) ?? {}

    return walletFiltered
}

export const insertWallet = async (wallet: Wallet) : Promise<number> => {

    const wallets = await getWallets()

    wallet.id = wallets.length + 1

    wallets.push(wallet)

    await AsyncStorage.setItem("walletsData", JSON.stringify(wallets))
    
    return wallet.id
}

export const updateWallet = async (wallet: Wallet) => {

    const wallets = await getWallets()

    wallets.forEach(item => {
        if(wallet.default && wallet.key != item.key) item.default = false
        if(wallet.key === item.key) {
            item["name"] = wallet.name
            item["type"] = wallet.type
            item["lastBalance"] = wallet.lastBalance
            item["lastReceived"] = wallet.lastReceived
            item["lastSended"] = wallet.lastSended
            item["address"] = wallet.address
            item["default"] = wallet.default
            item["payfee"] = wallet.payfee
            item["network"] = wallet.network
        }
    })

    console.log("wallets", wallets)

    await AsyncStorage.setItem("walletsData", JSON.stringify(wallets))
}

export const deleteWallet = async (key: string) => {

    const walletList = await getWallets()

    const filtered = walletList.filter(wallet => wallet.key != key)

    await AsyncStorage.setItem("walletsData", JSON.stringify(filtered))
}

export const deleteWallets = async () => await AsyncStorage.removeItem("walletsData")
