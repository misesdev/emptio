import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"
import { DBEvents } from "./database/events"

const database = {
    events: DBEvents
}

const clear = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.clear()
}

export const storageService = {
    database,
    clear
}


