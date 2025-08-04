import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import { NDKEvent, NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import useNDKStore from "@services/zustand/useNDKStore"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import { pushMessage } from "@services/notification"
import { showMessage } from "@components/general/MessageBox"
import { useAccount } from "@src/context/AccountContext"
import { Utilities } from "@src/utils/Utilities"
import { useAuth } from "@src/context/AuthContext"

const useMenu = () => {
    
    const { logout } = useAuth()
    const { ndk } = useNDKStore()
    const { authService, userService } = useService()
    const appVersion = DeviceInfo.getVersion()
    const { user, setWallets, setFollows, setFollowsEvent } = useAccount()
    const { useTranslate } = useTranslateService()
    const [forceUpdate, setForceUpdate] = useState()
    const [shareVisible, setShareVisible] = useState(false)
    const [poolstats, setPoolstats] = useState<any>({})

    useEffect(() => {
        const relays: NDKRelay[] = Array.from(ndk.pool.relays.values())
        if(poolstats.connected != relays.filter(r => r.connected).length) {
            setPoolstats({
                total: relays.length,
                connected: relays.filter(r => r.connected).length
            })
        }
    }, [ndk])

    const copySecretKey = async () => {
        const biometrics = await authService.checkBiometrics()
        
        if (biometrics) {
            const pairKey = await userService.getNostrPairKey()
            Utilities.copyToClipboard(pairKey.getNsec())
        }
    }

    const copyPublicKey = async () => {
        const pairKey = await userService.getNostrPairKey()
        Utilities.copyToClipboard(pairKey.getNpub())
    }

    const deleteAccount = async () => {
        
        const deleteAccount = async () => {
            const result = await authService.signOut()

            if (result.success) 
            {
                if(setWallets) setWallets([])
                if(setFollows) setFollows([])
                if(setFollowsEvent) setFollowsEvent({} as NDKEvent)
                logout()
            }
            else if(result.message) 
                pushMessage(result.message)
        }

        showMessage({
            title: useTranslate("message.profile.wantleave"),
            message: useTranslate("message.profile.alertleave"),
            action: {
                label: useTranslate("commons.exit"),
                onPress: deleteAccount
            }
        })
    }

    return {
        ndk,
        user,
        poolstats,
        appVersion,
        copyPublicKey,
        copySecretKey,
        deleteAccount,
        shareVisible,
        setShareVisible,
        forceUpdate,
        setForceUpdate
    }
}

export default useMenu
