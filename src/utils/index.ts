import Clipboard from "@react-native-clipboard/clipboard"
import { pushMessage } from "@services/notification"
import { useTranslate } from "@services/translate"
import { User, WalletType } from "@services/memory/types"
import { hexToNpub } from "../services/converter"

export const copyToClipboard = (text: string) => {
    
    Clipboard.setString(text)
    
    useTranslate("message.copied").then(pushMessage)
}

export const getUserName = (user: User, maxsize: number = 16): string => {
    const username = user.display_name ?? user.displayName ?? user.name ?? user.pubkey ?? ""

    if(username.length > maxsize)
        return `${username?.substring(0,maxsize)}..` 

    return username
}

export const getClipedContent = (content: string, limit: number=50) => {
    if(content.length > limit)
        return `${content.substring(0,limit)}...`
    return content
}

export const getDisplayPubkey = (pubkey: string, maxSize: number = 20) => {
    const npub = hexToNpub(pubkey)
    return `${npub.substring(0, maxSize)}...${npub.substring(58)}`
}

export const copyPubkey = (pubkey: string) => {
    const npub = hexToNpub(pubkey)
    copyToClipboard(npub)
}

export const replaceContentEvent = (content: string) => {
    return content.replaceAll("nostr:", "")
        .replaceAll(" note", " \nnote")
        .replaceAll(" nevent", " \nnevent")
        .replaceAll("\n\nhttps", "\nhttps")
        .replaceAll("\n\nhttps", "\nhttps")
        .replaceAll("\nhttps", "\n\nhttps")
        .replaceAll("\nhttps", "\n\nhttps")
        .replaceAll(" https", " \n\nhttps")
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

export const extractVideoUrl = (content: string) => {
    const videoRegex = /(https?:\/\/[^\s]+?\.(mp4|webm|mov|mkv|avi|flv|ogg))/i;

    const match = content.match(videoRegex);

    return match ? match[0] : null;
}
