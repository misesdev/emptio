import { Language, TranslateWords } from "@services/translate/types"
import { ReactElement, ReactNode, createContext, useContext } from "react"
import useLoadLanguage from "../hooks/useLoadLanguage"

type TranslateContextType = {
    language: Language;
    languages: Language[];
    setLanguage: (language: Language) => void;
    useTranslate: (wordKey: TranslateWords) => string;
}

const TranslateContext =  createContext<TranslateContextType|null>(null)

const useTranslateService = (): TranslateContextType => {
    const context = useContext(TranslateContext)
    if(!context)
        throw new Error("TranslateContext not found")
    return context
}

const TranslateProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const { language, setLanguage, useTranslate, languages } = useLoadLanguage()

    return (
        <TranslateContext.Provider value={{ 
            language,
            setLanguage, 
            useTranslate,
            languages 
        }}>
            {children}
        </TranslateContext.Provider>
    )
}

export { TranslateProvider, useTranslateService }
