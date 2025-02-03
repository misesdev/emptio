import Clipboard from "@react-native-clipboard/clipboard"
import { pushMessage } from "@services/notification"
import { useTranslate } from "@services/translate"
import { User, WalletType } from "@services/memory/types"
import { hexToNpub } from "../services/converter"

export const copyToClipboard = (text: string) => {
    
    Clipboard.setString(text)
    
    useTranslate("message.copied").then(pushMessage)
}

export const getUserName = (user: User, maxSize: number = 16): string => {
    const userName = user.display_name ?? user.name ?? user.pubkey ?? ""

    if(userName.length > maxSize)
        return `${userName?.substring(0,maxSize)}..` 

    return userName
}

export const getDisplayPubkey = (pubkey: string, maxSize: number = 20) => {
    const npub = hexToNpub(pubkey)

    return `${npub.substring(0, maxSize)}...${npub.substring(58)}`
}

export const replaceContentEvent = (content: string) => {
    return content.replaceAll("nostr:", "")
        .replaceAll(" note", " \n\rnote")
        .replaceAll(" nevent", " \n\rnevent")
        .replaceAll("\n\r\n\rhttps", "\n\rhttps")
        .replaceAll("\n\nhttps", "\nhttps")
        .replaceAll("\n\rhttps", "\n\r\n\rhttps")
        .replaceAll("\nhttps", "\n\r\n\rhttps")
        .replaceAll(" https", " \n\r\n\rhttps")
}

export const getDescriptionTypeWallet = async (type: WalletType) => {
    switch(type)
    {
        case "testnet":
            return await useTranslate("wallet.bitcoin.testnet.tag")
        case "bitcoin":
            return await useTranslate("wallet.bitcoin.tag")
        case "lightning":
            return await useTranslate("wallet.lightning.tag")
        default:
            return await useTranslate("wallet.bitcoin.tag")
    }
}

