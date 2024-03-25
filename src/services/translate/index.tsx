import { getLanguage } from "../memory"
import pt from "./languages/pt"
import en from "./languages/pt"
import { TranslateWords } from "./types"

const language = getLanguage()

export const useTranslate = (words: TranslateWords): string => {
    
    const languages = { pt, en }

    return languages[language][words]
} 