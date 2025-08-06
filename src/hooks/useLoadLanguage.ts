import { useEffect, useMemo, useState } from "react"
import { TranslateService } from "@services/translate/TranslateService"
import { Language, TranslateWords } from "@services/translate/types"

const useLoadLanguage = () => {

    const service = useMemo(() => new TranslateService(), [])
    const [language, setLanguage] = useState<Language>({ label: "English", selector: "en" })
    const [languages, setLanguages] = useState<Language[]>([])

    useEffect(() => { 
        const load = async () => await loadLanguage()
        load()
    }, [])

    const loadLanguage = async () => {
        await service.init()
        
        const language = await service.getLanguage()
        setLanguage(language)
        
        const languages = await service.listLanguages()
        setLanguages(languages)
    }

    const useTranslate = (wordKey: TranslateWords) => {
        return service.translate(language, wordKey)
    }

    return {
        language,
        setLanguage,
        useTranslate,
        languages
    }
}

export default useLoadLanguage
