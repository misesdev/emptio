import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store"
import { HexPairKeys, User } from "./types"

const pairKeys: HexPairKeys = { privateKey: "", publicKey: "" }

export const getPairKeys = async () => {

    const userData = await getItemAsync("userData")

    if (userData) {
        const user: User = JSON.parse(userData)
        pairKeys.privateKey = user.privateKey ? user.privateKey : pairKeys.privateKey
        pairKeys.publicKey = user.publicKey ? user.publicKey : pairKeys.publicKey
    }

    return pairKeys
}

export const getUser = async (): Promise<User> => {

    const user = await getItemAsync("userData")

    if (user)
        return JSON.parse(user)

    return { privateKey: "", publicKey: "" }
}

export const insertUpdateUser = async (userData: User) => await setItemAsync("userData", JSON.stringify(userData))

export const deleteUser = async () => await deleteItemAsync("userData")