import { storageService } from "@services/memory"
import { TransactionInfo, Wallet, Transaction } from "@services/memory/types"
import { walletService } from "@services/wallet"
import { useCallback, useEffect, useState } from "react"

export const useWallet = ({ navigation, route }: any) => {

    const [refreshing, setRefreshing] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [wallet, setWallet] = useState<Wallet>(route.params?.wallet)

    useEffect(() => {
        setTimeout(loadTransactions, 20)
    }, [])

    const loadTransactions = async () => {
        setRefreshing(true)
        // search transactions and update wallet lastBalance
        let walletInfo = await  walletService.listTransactions(wallet)
        setTransactions(walletInfo.transactions)
        if(wallet.lastBalance != walletInfo.balance) {
            setWallet((prev: Wallet) => ({
                ...prev,
                lastBalance: walletInfo.balance,
                lastReceived: walletInfo.received,
                lastSended: walletInfo.sended
            }))
            await storageService.wallets.update({
                ...wallet,
                lastBalance: walletInfo.balance,
                lastReceived: walletInfo.received,
                lastSended: walletInfo.sended
            })
        }
        setRefreshing(false)
    }

    const openTransaction = useCallback((transaction: TransactionInfo) => {
        navigation.navigate("wallet-transaction-stack", { wallet, transaction })
    }, [wallet, navigation])

    const showOptions = useCallback(() => {
        navigation.navigate("wallet-settings-stack", { wallet })
    }, [wallet, navigation])
   
    return {
        wallet,
        refreshing,
        transactions,
        showOptions,
        openTransaction,
        loadTransactions
    }
}
