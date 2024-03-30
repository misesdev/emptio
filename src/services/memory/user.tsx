import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store"
import { User } from "./types"

export const getUser = async (): Promise<User> => {

    const user = await getItemAsync("userData")

    if (user)
        return JSON.parse(user)

    return { privateKey: "", publicKey: "" }
}

export const insertUpdateUser = async (userData: User) => await setItemAsync("userData", JSON.stringify(userData))

export const deleteUser = async () => await deleteItemAsync("userData")