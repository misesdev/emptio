import { getLanguage } from "../memory/language"
import { TranslateWords } from "./types"
import pt from "./languages/pt"
import en from "./languages/en"

export const useTranslate = async (words: TranslateWords): Promise<string> => {
    
    const languages = { pt, en }

    const language = await getLanguage()

    return languages[language.selector][words]
} 
