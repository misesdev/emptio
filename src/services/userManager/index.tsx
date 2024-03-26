import { clearStorage, insertUser } from "../memory"
import { User } from "../memory/types"
import { createPairKeys, derivatePublicKey, getHexKeys } from "../nostr"
import { getUserData } from "../nostr/pool"

type signUp = {
    name: string,
    callback: () => void
}

export const SignUp = ({ name, callback }: signUp) => {
    try {
        const { privateKey, publicKey } = createPairKeys()

        insertUser({ name, privateKey, publicKey })

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

    insertUser(userData)

    callback()
}

export const SignOut = (callback: () => void) => {

    clearStorage()

    callback()
}

