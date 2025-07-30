import { Language, TranslateWords } from "@services/translate/types"
import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { TranslateService } from "../services/translate/TranslateService"

type TranslateContextType = {
    language: Language,
    setLanguage: (language: Language) => void,
    useTranslate: (wordKey: TranslateWords) => string
}

const TranslateContext =  createContext<TranslateContextType|null>(null)

const useTranslateService = (): TranslateContextType => {
    const context = useContext(TranslateContext)
    if(!context)
        throw new Error("TranslateContext not found")
    return context
}

const TranslateProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [_service,_] = useState(new TranslateService())
    const [language, setLanguage] = useState<Language>({ label: "English", selector: "en" })

    useEffect(() => {
        _service.getLanguage().then(setLanguage)
    }, [])
  
    const useTranslate = (wordKey: TranslateWords) => _service.translate(language, wordKey)

    return (
        <TranslateContext.Provider value={{ language, setLanguage, useTranslate }}>
            {children}
        </TranslateContext.Provider>
    )
}

export { TranslateProvider, useTranslateService }
