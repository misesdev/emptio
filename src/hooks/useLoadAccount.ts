import { useEffect, useState } from "react"
import UserService from "@services/user/UserService"
import useChatStore from "@services/zustand/useChatStore"
import useNDKStore from "@services/zustand/useNDKStore"
import MessageService from "@services/message/MessageService"
import { SubscriptionService } from "@services/nostr/SubscriptionService"
import { User } from "@services/user/types/User"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { WalletStorage } from "@storage/wallets/WalletStorage"
import { AppSettingsStorage } from "@storage/settings/AppSettingsStorage"
import { Wallet } from "@services/wallet/types/Wallet"
import { StoredItem } from "@storage/types"
import { AppSettings } from "@storage/settings/types"

type Props = { 
    user: User;
    setSettings: (s: AppSettings) => void;
    setWallets: (ws: StoredItem<Wallet>[]) => void;
    setFollowsEvent: (e: NDKEvent) => void;
}

const useLoadAccount = ({ 
    user, setSettings, setWallets, setFollowsEvent 
}: Props) => {
    const { setChats } = useChatStore()
    const { setNdkSigner, ndk } = useNDKStore()
    const [loading, setLoading] = useState(true)
    const [_service, _] = useState(new UserService(user))
    const [_subscriber, __] = useState(new SubscriptionService(ndk))
    const walletStorage = new WalletStorage()
    const settingsStorage = new AppSettingsStorage()
    const messageService = new MessageService(user)

    useEffect(() => { loadUserData() }, [])

    const loadUserData = async () => {
        const settings = await settingsStorage.get()
        if(settings) setSettings(settings)
        const wallets = await walletStorage.list()
        if(wallets) setWallets(wallets)
        const chats = await messageService.listChats()
        if(chats.success) 
            setChats(chats.data ?? [])
        
        if(user.keyRef) {
            await setNdkSigner(user)
            _subscriber.subscribeUser(user)
            const followsEvent = await _service.getFollowsEvent()
            if(followsEvent) {
                setFollowsEvent(followsEvent)
            }
        }
        setLoading(false)
    }

    return {
        user,
        loading
    }
}

export default useLoadAccount
