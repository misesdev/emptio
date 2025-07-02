import AsyncStorage from "@react-native-async-storage/async-storage"
import { Wallet } from "../types"

export class WalletStorage {
    
    static async get(key: string) : Promise<Wallet> {
        let wallets = await this.list()
        let wallet = wallets.find(w => w.key == key)
        if(!wallet)
            throw new Error("wallet not found")
        return wallet
    }

    static async add(wallet: Wallet) : Promise<void> {
        let wallets = await this.list()
        wallets.push(wallet)
        await this.save(wallets)
    }
    
    static async update(wallet: Wallet) : Promise<void> {
        let wallets = await this.list()
        wallets.forEach(item => {
            if(wallet.default && wallet.key != item.key) item.default = false
            if(wallet.key === item.key)
            {
                item["name"] = wallet.name
                item["lastBalance"] = wallet.lastBalance
                item["lastReceived"] = wallet.lastReceived
                item["lastSended"] = wallet.lastSended
                item["address"] = wallet.address
                item["default"] = wallet.default
                item["payfee"] = wallet.payfee
                item["network"] = wallet.network
            }
        })
        await this.save(wallets)
    }

    static async delete(key: string) : Promise<void> {
        let wallets = await this.list()
        await this.save(wallets.filter(w => w.key != key))
    }

    static async list() : Promise<Wallet[]> {
        let wallets: Wallet[] = []
        let data = await AsyncStorage.getItem("walletsdata")
        if(data)
            wallets = JSON.parse(data) as Wallet[]
        return wallets
    }

    static async clear() : Promise<void> {
        await AsyncStorage.removeItem("walletsdata")
    }

    private static async save(wallets: Wallet[]) : Promise<void> {
        await AsyncStorage.setItem("walletsdata", JSON.stringify(wallets))
    }
}

