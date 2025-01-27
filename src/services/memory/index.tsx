import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"

export const clearStorage = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.setItem("pairkeys", "")
}
