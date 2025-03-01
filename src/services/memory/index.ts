import AsyncStorage from "@react-native-async-storage/async-storage"
import EncryptedStorage from "react-native-encrypted-storage"
import { saveLanguage, getLanguages, getLanguage } from "./language"
import { insertPairKey, getPairKeys, getPairKey, deletePairKey } from "./pairkeys"
import { getRelays, insertRelay, setRelays, deleteRelay } from "./relays"
import { addPubkeyOnBlackList, getBlackListPubkeys, getFeedVideoSettings,
    getSettings, saveFeedVideoSettings, saveSettings } from "./settings"
import { getUser, insertUpdateUser, deleteUser } from "./user"
import { clearDefaultWallets, deleteWallet, deleteWallets, getWallet, getWallets, 
    insertWallet, updateWallet } from "./wallets"
import { deletePaymentKey, getPaymentKey, getPaymentKeys, savePaymentKey } from "./payments"

const clearStorage = async () => {
    await AsyncStorage.clear()
    await EncryptedStorage.clear()
}

const language = {
    add: saveLanguage,
    get: getLanguage,
    list: getLanguages
}

const pairkeys = {
    add: insertPairKey,
    get: getPairKey,
    list: getPairKeys,
    delete: deletePairKey
}

const relays = {
    set: setRelays,
    add: insertRelay,
    list: getRelays,
    delete: deleteRelay
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

const user = {
    get: getUser,
    save: insertUpdateUser,
    delete: deleteUser
}

const wallets = {
    add: insertWallet,
    update: updateWallet,
    get: getWallet,
    list: getWallets,
    delete: deleteWallet,
    clearDefault: clearDefaultWallets,
    clear: deleteWallets
}

const paymentkeys = {
    add: savePaymentKey,
    get: getPaymentKey,
    list: getPaymentKeys,
    delete: deletePaymentKey 
}

export const storageService = {
    settings,
    language,
    pairkeys,
    paymentkeys,
    relays,
    user,
    wallets,
    clear: clearStorage
}
