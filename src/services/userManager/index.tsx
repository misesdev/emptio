import { clearStorage, insertUser } from "../memory"
import { createPairKeys, getHexKeys } from "../nostr"
import { getUserData, pushUserData } from "../nostr/pool"
import { hexToBytes } from "@noble/hashes/utils"
import { User } from "../memory/types"
import { nip19 } from "nostr-tools"

type signUp = {
    userName: string,
    callback: () => void
}

export const SignUp = async ({ userName, callback }: signUp) => {
    try {

        const { privateKey, publicKey } = createPairKeys()

        const userData: User = { 
            name: userName,
            privateKey: privateKey,
            publicKey: publicKey  
        }

        await pushUserData(userData)

        console.log(nip19.nsecEncode(hexToBytes(privateKey)))

        insertUser(userData)

        callback()
    }
    catch (ex) {

    }
}

type signIn = {
    secretKey: string,
    callback: () => void
}

export const SignIn = async ({ secretKey, callback }: signIn) => {

    const { privateKey, publicKey } = getHexKeys(secretKey)

    const userData = await getUserData(publicKey)

    userData.privateKey = privateKey
    userData.publicKey = publicKey

    console.log(userData)

    insertUser(userData)

    callback()
}

export const SignOut = (callback: () => void) => {

    clearStorage()

    callback()
}

