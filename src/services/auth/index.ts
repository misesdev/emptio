import { useTranslate } from "@services/translate"
import ReactNativeBiometrics from "react-native-biometrics";
import { PairKey, User } from "../memory/types";
import { createPairKeys, getHexKeys } from "../nostr";
import { storageService } from "../memory";
import useNDKStore from "../zustand/ndk";
import { getUserData, pushUserData } from "../nostr/pool";
import { trackException, Response } from "../telemetry";
import useChatStore from "../zustand/chats";
import { DBEvents } from "../memory/database/events";

const checkBiometric = async () => {
    
    const rnBiometrics = new ReactNativeBiometrics()
    const { available } = await rnBiometrics.isSensorAvailable()

    if (available) {
        const { success } = await rnBiometrics.simplePrompt({
            promptMessage: await useTranslate("commons.authenticate.message")
        })
        return success
    }

    return false
}

interface SignUpProps { 
    userName: string, 
    setUser?: (user: User) => void,  
}

const signUp = async ({ userName, setUser }: SignUpProps): Promise<Response<User|null>> => {
    try {    
        const pairKey: PairKey = createPairKeys()

        const profile: User = {
            name: userName.trim(),
            pubkey: pairKey.publicKey,
            display_name: userName.trim(),
            keychanges: pairKey.key,
        }
        
        await storageService.secrets.addPairKey(pairKey)
        
        await useNDKStore.getState().setNdkSigner(profile)
       
        await pushUserData(profile, pairKey)

        await storageService.user.save(profile)
        
        if (setUser) setUser(profile)

        return { success: true, data: profile }
    }
    catch (ex) {
        return trackException(ex, null)
    }
}

interface SignProps { 
    secretKey: string, 
    setUser?: (user: User) => void,
}

const signIn = async ({ secretKey, setUser }: SignProps) : Promise<Response<User|null>> => {
    try {
        const pairKey: PairKey = getHexKeys(secretKey)

        const userData = await getUserData(pairKey.publicKey)

        userData.keychanges = pairKey.key

        await storageService.user.save(userData)

        await storageService.secrets.addPairKey(pairKey)

        if (setUser) setUser(userData)
        
        return { success: true, data: userData }
    }
    catch (ex) {
        return trackException(ex, null)
    }
}

const isLogged = async () : Promise<Response<User|null>> => {
    try {
        const user: User = await storageService.user.get()

        const pairKey = await storageService.secrets.getPairKey(user.keychanges ?? "", false)

        user.pubkey = pairKey.publicKey

        return { success: !!pairKey.privateKey, data: user }
    } 
    catch(ex) { 
        return trackException(ex, null)
    }
}

const signOut = async (): Promise<Response<any>> => {
    try {
        await DBEvents.clear()
        await storageService.clear()
        useChatStore.getState().setChats([])
        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const authService = {
    checkBiometric,
    signIn,
    signUp,
    isLogged,
    signOut
}
