import AsyncStorage from "@react-native-async-storage/async-storage"
import { Language } from "../translate/types"

export const saveLanguage = async (language: Language) => { 
    await AsyncStorage.setItem("language", JSON.stringify(language))
}

export const getLanguage = async (): Promise<Language> => {

    var language: Language = { label: "English", selector: "en" }
    
    const register = await AsyncStorage.getItem("language")

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
