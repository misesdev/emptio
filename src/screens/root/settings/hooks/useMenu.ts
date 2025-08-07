import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import { NDKRelay } from "@nostr-dev-kit/ndk-mobile"
import useNDKStore from "@services/zustand/useNDKStore"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { useService } from "@src/providers/ServiceProvider"
import { pushMessage } from "@services/notification"
import { showMessage } from "@components/general/MessageBox"
import { Utilities } from "@src/utils/Utilities"
import { useAuth } from "@src/context/AuthContext"

const useMenu = () => {
    
    const { logout } = useAuth()
    const { ndk } = useNDKStore()
    const appVersion = DeviceInfo.getVersion()
    const { useTranslate } = useTranslateService()
    const [forceUpdate, setForceUpdate] = useState()
    const [shareVisible, setShareVisible] = useState(false)
    const [poolstats, setPoolstats] = useState<any>({})
    const { authService, userService, translateService } = useService()

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

    const signOut = async () => {
        const result = await authService.signOut()
        if (result.success) {
            await translateService.init()
            logout()
        } else if(result.message) 
            pushMessage(result.message)
    }

    const deleteAccount = async () => {
        showMessage({
            title: useTranslate("message.profile.wantleave"),
            message: useTranslate("message.profile.alertleave"),
            action: {
                label: useTranslate("commons.exit"),
                onPress: signOut 
            }
        })
    }

    return {
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
