import Clipboard from "@react-native-clipboard/clipboard"
import { pushMessage } from "@services/notification"
import { useTranslate } from "@services/translate"
import { WalletType } from "@services/memory/types"

export const copyToClipboard = (text: string) => {
    
    Clipboard.setString(text)
    
    useTranslate("message.copied").then(pushMessage)
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

