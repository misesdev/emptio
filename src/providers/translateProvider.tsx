import { Language, TranslateWords } from "@services/translate/types"
import pt from "@services/translate/languages/pt"
import en from "@services/translate/languages/en"
import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { storageService } from "@services/memory"


interface TranslateContextType {
    language?: Language,
    setLanguage?: (language: Language) => void,
    useTranslate: (wordKey: TranslateWords) => string
}

const TranslateContext = createContext<TranslateContextType>({ useTranslate: (wordKey: TranslateWords) => wordKey })

const useTranslateService = (): TranslateContextType => useContext(TranslateContext)

const TranslateProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [languages,] = useState({ pt, en })
    const [language, setLanguage] = useState<Language>({ label: "", selector: "en" })
    
    useEffect(() => {
        storageService.language.get().then(setLanguage)
    }, [])
    
    const useTranslate = (wordKey: TranslateWords): string => 
        languages[language.selector][wordKey]

    return (
        <TranslateContext.Provider value={{ language, setLanguage, useTranslate }}>
            {children}
        </TranslateContext.Provider>
    )
}

export { TranslateProvider, useTranslateService }
