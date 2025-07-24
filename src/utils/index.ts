import Clipboard from "@react-native-clipboard/clipboard"
import { useTranslate } from "@services/translate/TranslateService"
import { pushMessage } from "@services/notification"
import { hexToNpub } from "@services/converter"
import theme from "../theme"
import { BNetwork } from "bitcoin-tx-lib"
import { User } from "@services/user/types/User"

export const copyToClipboard = (text: string) => {
    
    Clipboard.setString(text)
    
    useTranslate("message.copied").then(pushMessage)
}

export const getUserName = (user: User, maxsize: number = 16): string => {
    const username = user.display_name ?? user.displayName ?? user.name ?? user.pubkey ?? ""

    if(username.length > maxsize)
        return `${username?.substring(0,maxsize)}...` 

    return username
}

export const getClipedContent = (content: string, limit: number=50) => {
    if(content.length > limit)
        return `${content.substring(0,limit)}...`
    return content
}

export function shortenString(value: string, size: number) : string {
    let length = Math.ceil(size / 2);
    
    return `${value.substring(0, length)}...${value.slice(-length)}`
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
        .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, "$1\n\n$2")
        //.replaceAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1\n\n$2")
}

export const getDescriptionTypeWallet = async (type: BNetwork) => {
    switch(type)
    {
        case "testnet":
            return await useTranslate("wallet.bitcoin.testnet.tag")
        case "mainnet":
            return await useTranslate("wallet.bitcoin.tag")
        // case "lightning":
        //     return await useTranslate("wallet.lightning.tag")
        // default:
        //     return await useTranslate("wallet.bitcoin.tag")
    }
}

export const extractVideoUrl = (content: string) => {
    const videoRegex = /(https?:\/\/[^\s]+?\.(mp4|webm|mov|mkv|avi|flv|ogg))/i;

    const match = content.match(videoRegex);

    return match ? match[0] : null;
}

export const getColorFromPubkey = (pubkey: string): string => {
    if (!pubkey) return theme.colors.green; 

    let hash = 0;
    for (let i = 0; i < pubkey.length; i++) {
        hash = pubkey.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, "0")}` +
                  `${((hash >> 16) & 0xFF).toString(16).padStart(2, "0")}` +
                  `${((hash >> 8) & 0xFF).toString(16).padStart(2, "0")}`;

    return color;
}

export function distinctBy<T>(keySelector: (item: T) => string | number): (items: T[]) => T[] {
    return (items: T[]) => {
        const seen = new Set<string | number>()
        return items.filter(item => {
            const key = keySelector(item)
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
    }
}
