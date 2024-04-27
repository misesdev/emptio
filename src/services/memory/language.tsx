import { getItem, setItem } from "expo-secure-store"
import { Language } from "../translate/types"

export const saveLanguage = (language: Language) => setItem("language", JSON.stringify(language))

export const getLanguage = (): Language => {

    var language: Language = { label: "English", selector: "en" }
    
    const register = getItem("language")

    if(register)
        language = JSON.parse(register)
    
    return language
}

export const getLanguages = (): Language[] => {
    return [
        { label: "English", selector: "en" },
        { label: "Portuguese", selector: "pt" }
    ]
}