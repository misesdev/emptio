import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"

const clear = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.clear()
}

export const storageService = {
    clear
}


