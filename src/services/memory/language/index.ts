import AsyncStorage from "@react-native-async-storage/async-storage"
import { Language } from "@services/translate/types"

export class LanguageStorage {
    
    static async get() : Promise<Language> {
        var language: Language = { label: "English", selector: "en" }
        const register = await AsyncStorage.getItem("language")
        if(register)
            language = JSON.parse(register)
        return language
    }

    static list() : Language[] {
        return [
            { label: "English", selector: "en" },
            { label: "Portuguese", selector: "pt" }
        ]
    }

    static async save(language: Language) : Promise<void> {
        await AsyncStorage.setItem("language", JSON.stringify(language))
    }
}

