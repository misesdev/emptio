import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteItemAsync, setItemAsync } from "expo-secure-store"

export const clearStorage = async () => {
    await AsyncStorage.clear()
    await setItemAsync("pairkeys", "")
}
