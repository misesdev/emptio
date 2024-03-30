import { deleteItemAsync } from "expo-secure-store"

export const clearStorage = async () => {
    await deleteItemAsync("userData")
    await deleteItemAsync("walletsData")
    await deleteItemAsync("language")
    await deleteItemAsync("relays")
}