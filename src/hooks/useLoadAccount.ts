import { useEffect, useState } from "react"
import useChatStore from "@services/zustand/useChatStore"
import useNDKStore from "@services/zustand/useNDKStore"
import MessageService from "@services/message/MessageService"
import { SubscriptionService } from "@services/nostr/SubscriptionService"
import { AppSettingsStorage } from "@storage/settings/AppSettingsStorage"
import { WalletStorage } from "@storage/wallets/WalletStorage"
import { Wallet } from "@services/wallet/types/Wallet"
import { AppSettings } from "@storage/settings/types"
import { User } from "@services/user/types/User"
import { StoredItem } from "@storage/types"

const useLoadAccount = (user: User) => {
    const { setChats } = useChatStore()
    const { setNdkSigner, ndk } = useNDKStore()
    const [loading, setLoading] = useState(true)
    const [wallets, setWallets] = useState<StoredItem<Wallet>[]>([])
    const [settings, setSettings] = useState<AppSettings>({} as AppSettings)
    const subscriber = new SubscriptionService(ndk)

    useEffect(() => { loadUserData() }, [])

    const loadUserData = async () => {
        const settingsStorage = new AppSettingsStorage()
        const settings = await settingsStorage.get()
        if(settings) 
            setSettings(settings)

        const walletStorage = new WalletStorage()
        const wallets = await walletStorage.list()
        if(wallets) 
            setWallets(wallets)

        const messageService = new MessageService(user)
        const chats = await messageService.listChats()
        if(chats.success) 
            setChats(chats.data ?? [])
        
        if(user.keyRef) 
        {
            await setNdkSigner(user)
            subscriber.subscribeUser(user)
        }
        setLoading(false)
    }

    return {
        settings,
        setSettings,
        wallets, 
        setWallets,
        loading
    }
}

export default useLoadAccount
