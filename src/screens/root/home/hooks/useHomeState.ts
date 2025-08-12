import { useAccount } from "@/src/context/AccountContext"
import { useService } from "@/src/providers/ServiceProvider"
import { useTranslateService } from "@/src/providers/TranslateProvider"
import { BTransaction } from "@/src/services/wallet/types/Transaction"
import { pushMessage } from "@services/notification"
import { useState } from "react"
import { Vibration } from "react-native"

export const useHomeState = () => {

    const { walletService } = useService()
    const { wallets, setWallets } = useAccount()
    const { useTranslate } = useTranslateService()
    const [transactions, setTransactions] = useState<BTransaction[]>([])
    const [loading, setLoading] = useState(false)

    const loadData = async () : Promise<void> => {
        setLoading(true)
        
        if(wallets.length) Vibration.vibrate(45)

        setWallets(await walletService.list())

        // const cached = await walletService.allTransactions()
        // setTransactions((cached.data??[]) as BTransaction[])

        if (wallets.length <= 0)
            pushMessage(useTranslate("message.wallet.alertcreate"))

        setLoading(false)
    }

    return {
        loading,
        wallets,
        transactions,
        loadData
    }
}
