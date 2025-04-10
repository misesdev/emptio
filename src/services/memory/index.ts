import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"
import { SecretStorage } from "./pairkeys"
import { LanguageStorage } from "./language"
import { RelayStorage } from "./relays"
import { UserStorage } from "./user"
import { WalletStorage } from "./wallets"
import { DBEvents } from "./database/events"
import { PaymentStorage } from "./payments"
import { SettingsStorage } from "./settings"

const database = {
    events: DBEvents
}

const clear = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.clear()
}

export const storageService = {
    settings: SettingsStorage,
    language: LanguageStorage,
    secrets: SecretStorage,
    paymentkeys: PaymentStorage,
    relays: RelayStorage,
    user: UserStorage,
    wallets: WalletStorage,
    database,
    clear
}


