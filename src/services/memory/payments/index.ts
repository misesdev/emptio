import EncryptedStorage from "react-native-encrypted-storage"
import { PaymentKey } from "../types"

export class PaymentStorage {
  
    static async get(key: string) : Promise<PaymentKey> {
        let paymentKeys = await this.list()
        let paymentKey = paymentKeys.find(p => p.key == key)
        if(!paymentKey)
            throw new Error("payment key not found")
        return paymentKey
    }

    static async add(paymentKey: PaymentKey) : Promise<void> {
        let paymentKeys = await this.list()
        paymentKeys.push(paymentKey)
        await this.save(paymentKeys)
    }

    static async delete(key: string) : Promise<void> {
        let paymentKeys = await this.list()
        await this.save(paymentKeys.filter(p => p.key != key))
    }

    static async list() : Promise<PaymentKey[]> {
        let paymentKeys: PaymentKey[] = []
        let data = await EncryptedStorage.getItem("paymentkeys")
        if(data)
            paymentKeys = JSON.parse(data) as PaymentKey[]
        return paymentKeys
    }

    static async save(paymentKeys: PaymentKey[]) : Promise<void> {
        await EncryptedStorage.setItem("paymentkeys", JSON.stringify(paymentKeys))
    }

    static async clear() : Promise<void> {
        await EncryptedStorage.removeItem("paymentkeys")
    }
}


