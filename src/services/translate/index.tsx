import { getLanguage } from "../memory/language"
import { TranslateWords } from "./types"
import pt from "./languages/pt"
import en from "./languages/en"

export const useTranslate = (words: TranslateWords): string => {
    
    const languages = { pt, en }

    const language=  getLanguage()

    return languages[language][words]
} 