import { getItem, setItem } from "expo-secure-store"
import { Language } from "../translate/types"

export const setLanguage = (language: string) => setItem("language", language)

export const getLanguage = (): Language => {

    const language = getItem("language")
    
    switch (language) {
        case "pt":
            return language
        case "en":
            return language
        default:
            return "en"
    }
}