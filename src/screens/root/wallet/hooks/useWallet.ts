import { useService } from "@src/providers/ServiceProvider"
import { BTransaction } from "@services/wallet/types/Transaction"
import { Wallet } from "@services/wallet/types/Wallet"
import { useCallback, useEffect, useState } from "react"
import { UTXO } from "@services/wallet/types/Utxo"

export const useWallet = ({ navigation, route }: any) => {

    const { walletService } = useService()
    const [refreshing, setRefreshing] = useState(false)
    const [transactions, setTransactions] = useState<BTransaction[]>([])
    const [wallet, setWallet] = useState<Wallet>({} as Wallet)
    const [utxos, setUtxos] = useState<UTXO[]>([])

    useEffect(() => {
        setTimeout(loadTransactions, 20)
    }, [])

    const loadTransactions = async () => {
        setRefreshing(true)
        await walletService.init(route.params.id as string)
        setWallet(await walletService.get(route.params.id as string))
       
        // load cached transactions and utxos
        let cached = await walletService.listTransactions(true)
        if(cached.success) 
            await setDataState(cached.data ?? [], true)

        // load uncached transactions and utxos
        const result = await walletService.listTransactions(false)
        if(result.success)
            await setDataState(result.data??[], false)

        setRefreshing(false)
    }

    async function setDataState(txs: BTransaction[], cached: boolean=true)
    {
        let balance: number = 0
        let received = txs.filter(w => w.type == "received")
            .reduce((sum, t) => t.value + sum, 0)
        let sended = txs.filter(w => w.type == "sent")
            .reduce((sum, t) => t.value + sum, 0)
        
        const result = await walletService.listUtxos(cached)
        if(result.success && result.data) {
            balance = result.data.reduce((sum, u) => u.value + sum, 0)
            setUtxos(result.data)
        }
            
        if(wallet?.lastBalance != balance) 
        {
            setWallet((prev: Wallet) => ({
                ...prev,
                lastBalance: balance,
                lastReceived: received,
                lastSended: sended
            }))
        }
        setTransactions(transactions)
    }

    const openTransaction = useCallback((transaction: BTransaction) => {
        navigation.navigate("wallet-transaction", { transaction })
    }, [wallet, navigation])

    const showOptions = useCallback(() => {
        navigation.navigate("wallet-settings", { wallet })
    }, [wallet, navigation])
   
    return {
        wallet,
        utxos,
        transactions,
        showOptions,
        openTransaction,
        loadTransactions,
        refreshing
    }
}
