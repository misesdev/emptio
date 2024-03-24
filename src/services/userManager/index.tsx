import { deleteUser, insertUser } from "../memory"
import { createPairKeys, getPublicKey } from "../nostr"

type signUp = {
    userName: string,
    callback: () => void
}

export const SignUp = ({ userName, callback }: signUp) => {
    try 
    {
        const { privateKey, publicKey } = createPairKeys()

        insertUser({ userName, privateKey, publicKey })

        callback()
    } 
    catch (ex) {

    }
}

type signIn = {
    privateKey: string
}

export const SignIn = ({ privateKey }: signIn) => {
    const publicKey = getPublicKey(privateKey)

    insertUser({ privateKey, publicKey })
}

export const SignOut = () => {
    deleteUser()
}

