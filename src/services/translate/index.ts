import { TranslateWords } from "./types"
import pt from "./languages/pt"
import en from "./languages/en"
import { LanguageStorage } from "../memory/language"

export const useTranslate = async (words: TranslateWords): Promise<string> => {
    
    const languages = { pt, en }

    const language = await LanguageStorage.get() 

    return languages[language.selector][words]
} 
