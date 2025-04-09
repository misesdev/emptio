import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"
import { addPubkeyOnBlackList, getBlackListPubkeys, getFeedVideoSettings,
    getSettings, saveFeedVideoSettings, saveSettings } from "./settings"
import { searchRelays } from "../nostr/pool"
import { SecretStorage } from "./pairkeys"
import { LanguageStorage } from "./language"
import { RelayStorage } from "./relays"
import { UserStorage } from "./user"
import { WalletStorage } from "./wallets"
import { DBEvents } from "./database/events"
import { PaymentStorage } from "./payments"

const language = {
    add: LanguageStorage.save,
    get: LanguageStorage.get,
    list: LanguageStorage.list
}

const pairkeys = {
    add: SecretStorage.addPairKey,
    get: SecretStorage.getPairKey,
    delete: SecretStorage.deletePairKey
}

const secrets = {
    get: SecretStorage.getSecret,
    add: SecretStorage.addSecret,
    delete: SecretStorage.deleteSecret,
}

const relays = {
    add: RelayStorage.add,
    list: RelayStorage.list,
    delete: RelayStorage.remove,
    search: searchRelays
}

const settings = {
    save: saveSettings,
    get: getSettings,
    feedVideos: {
        save: saveFeedVideoSettings,
        get: getFeedVideoSettings
    },
    blackList: {
        add: addPubkeyOnBlackList,
        get: getBlackListPubkeys
    }
}

const database = {
    events: {
        add: DBEvents.insert,
        delete: DBEvents.delete,
        list: DBEvents.listByCategory
    }
}

const clear = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.clear()
}

export const storageService = {
    settings,
    language,
    pairkeys,
    secrets,
    paymentkeys: PaymentStorage,
    relays,
    user: UserStorage,
    wallets: WalletStorage,
    database,
    clear
}
