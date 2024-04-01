import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteItemAsync } from "expo-secure-store"

export const clearStorage = async () => {
    await AsyncStorage.removeItem("userData")
    await AsyncStorage.removeItem("walletsData")
    await AsyncStorage.removeItem("transactions")
    await AsyncStorage.removeItem("language")
    await AsyncStorage.removeItem("relays")
    await deleteItemAsync("pairkeys")
}