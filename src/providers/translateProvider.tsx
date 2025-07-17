import { Language, TranslateWords } from "@services/translate/types"
import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { TranslateService } from "../services/translate/TranslateService"

interface TranslateContextType {
    language?: Language,
    setLanguage?: (language: Language) => void,
    useTranslate: (wordKey: TranslateWords) => Promise<string>
}

const TranslateContext = createContext<TranslateContextType>({ useTranslate: async (wordKey: TranslateWords) => wordKey })

const useTranslateService = (): TranslateContextType => useContext(TranslateContext)

const TranslateProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const service = new TranslateService()
    const [language, setLanguage] = useState<Language>()

    useEffect(() => {
        service.getLanguage().then(setLanguage)
    }, [])
    
    const useTranslate = async (wordKey: TranslateWords) => 
        await service.translate(wordKey)

    return (
        <TranslateContext.Provider value={{ language, setLanguage, useTranslate }}>
            {children}
        </TranslateContext.Provider>
    )
}

export { TranslateProvider, useTranslateService }
