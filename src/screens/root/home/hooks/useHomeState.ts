import { useAccount } from "@/src/context/AccountContext"
import { useService } from "@/src/providers/ServiceProvider"
import { useTranslateService } from "@/src/providers/TranslateProvider"
import { pushMessage } from "@services/notification"
import { useState } from "react"
import { Vibration } from "react-native"

export const useHomeState = () => {

    const { walletService } = useService()
    const { wallets, setWallets } = useAccount()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)

    const loadData = async () : Promise<void> => {
        setLoading(true)
        
        if(wallets.length) Vibration.vibrate(45)

        if(setWallets) setWallets(await walletService.list())

        if (wallets.length <= 0)
            pushMessage(useTranslate("message.wallet.alertcreate"))

        setLoading(false)
    }

    return {
        loading,
        wallets,
        loadData
    }
}
