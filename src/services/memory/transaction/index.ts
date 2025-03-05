import AsyncStorage from "@react-native-async-storage/async-storage"
import { Transaction } from "../types"

export const getTransactions = async (): Promise<Transaction[]> => {

    var transactions: Transaction[] = []

    const data = await AsyncStorage.getItem("transactions")

    if (data)
        transactions = JSON.parse(data) as Transaction[]

    return transactions
}

export const insertTransaction = async (transaction: Transaction) => {

    const transactions = await getTransactions()

    transactions.push(transaction)

    await AsyncStorage.setItem("transactions", JSON.stringify(transactions))
}

export const deleteTransaction = async (transaction: Transaction) => {

    const transactions = await getTransactions()

    var filtered = transactions.filter(t => t.txid != transaction.txid)

    await AsyncStorage.setItem("transactions", JSON.stringify(filtered))
}

export const deleteTransactions = async () => await AsyncStorage.removeItem("transactions")
