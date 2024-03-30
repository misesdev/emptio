import { getLanguage } from "../memory/language"
import pt from "./languages/pt"
import en from "./languages/en"
import { TranslateWords } from "./types"

const language = getLanguage()

export const useTranslate = (words: TranslateWords): string => {
    
    const languages = { pt, en }

    return languages[language][words]
} 