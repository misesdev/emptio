
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Transaction } from "./types"

export const getTransaction = async (): Promise<Transaction[]> => {

    var transactions: Transaction[] = []

    const data = await AsyncStorage.getItem("transactions")

    if (data)
        transactions = JSON.parse(data)

    return transactions
}

export const insertTransaction = async (transaction: Transaction) => {

    const transactions = await getTransaction()

    transactions.push(transaction)

    await AsyncStorage.setItem("transactions", JSON.stringify(transactions))
}

export const deleteTransaction = async (transaction: Transaction) => {

    const transactions = await getTransaction()

    transactions.splice(transactions.indexOf(transaction), 1)

    await AsyncStorage.setItem("transactions", JSON.stringify(transactions))
}

export const deleteTransactions = async () => await AsyncStorage.removeItem("transactions")