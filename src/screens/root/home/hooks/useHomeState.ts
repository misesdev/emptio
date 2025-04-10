
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import { storageService } from "@services/memory"
import { pushMessage } from "@services/notification"
import { useState } from "react"
import { Vibration } from "react-native"

export const useHomeState = () => {

    const { wallets, setWallets } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)

    const loadData = async () : Promise<void> => {
        setLoading(true)
        
        if(wallets.length) Vibration.vibrate(45)

        if(setWallets) setWallets(await storageService.wallets.list())

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
