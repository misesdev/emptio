import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import useNDKStore from "@services/zustand/ndk"
import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import { NDKRelay, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { authService } from "@services/auth"
import { storageService } from "@services/memory"
import { copyToClipboard } from "@src/utils"
import { hexToBytes } from "bitcoin-tx-lib"
import { pushMessage } from "@services/notification"
import { showMessage } from "@components/general/MessageBox"
import { nip19 } from "nostr-tools";

const useMenu = ({ navigation }: any) => {
    
    const { ndk } = useNDKStore()
    const appVersion = DeviceInfo.getVersion()
    const { user, setUser, setWallets, setFollows, setFollowsEvent } = useAuth()
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
        const biometrics = await authService.checkBiometric()
        
        if (biometrics) {
            const { privateKey } = await storageService.secrets.getPairKey(user?.keychanges ?? "")
            const secretkey = nip19.nsecEncode(hexToBytes(privateKey))
            copyToClipboard(secretkey)
        }
    }

    const copyPublicKey = async () => {
        const { publicKey } = await storageService.secrets.getPairKey(user?.keychanges ?? "")

        const pubKey = nip19.npubEncode(publicKey)

        copyToClipboard(pubKey)
    }

    const deleteAccount = async () => {
        
        const deleteAccount = async () => {
            const result = await authService.signOut()

            if (result.success) 
            {
                if(setUser) setUser({})
                if(setWallets) setWallets([])
                if(setFollows) setFollows([])
                if(setFollowsEvent) setFollowsEvent({} as NostrEvent)
                navigation.reset({ index: 0, routes: [{ name: "initial-stack" }] })
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
