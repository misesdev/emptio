import EncryptedStorage from "react-native-encrypted-storage"

export interface PaymentKey {
    key: string,
    secret: string
}

export const getPaymentKeys = async (): Promise<PaymentKey[]> => {
    var paymentKeys: PaymentKey[] = []
    var data = await EncryptedStorage.getItem("payment-keys") 
    if(data)
        paymentKeys = JSON.parse(data) as PaymentKey[]
    return paymentKeys
}

export const savePaymentKey = async (paymentKey: PaymentKey) => {
    const paymentKeys = await getPaymentKeys()
    paymentKeys.push(paymentKey)
    await EncryptedStorage.setItem("payment-keys", JSON.stringify(paymentKey))
}

export const getPaymentKey = async (key: string) : Promise<PaymentKey|undefined> => {
    var paymentKeys: PaymentKey[] = []
    var data = await EncryptedStorage.getItem("payment-keys") 
    if(data)
        paymentKeys = JSON.parse(data) as PaymentKey[]

    return paymentKeys.find(p => p.key == key)
}

export const deletePaymentKey = async (key: string) => {
    const paymentKeys = await getPaymentKeys()
    const data = paymentKeys.filter(p => p.key != key)
    await EncryptedStorage.setItem("payment-keys", JSON.stringify(data))
}
