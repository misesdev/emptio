import Clipboard from "@react-native-clipboard/clipboard"
import { pushMessage } from "../services/notification"
import { useTranslate } from "../services/translate"

export const copyToClipboard = (text: string) => {
    
    Clipboard.setString(text)

    pushMessage(useTranslate("message.copied"))
}

