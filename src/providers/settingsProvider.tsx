import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { Settings } from "@services/memory/types"
import { storageService } from "@services/memory"
import Currencies from "../constants/Currencies"

type SettingContextType = {
    settings: Settings,
    setSettings?: (settings: Settings) => void
}

const SettingsContext = createContext<SettingContextType>({ settings: {} })

const useSettings = (): SettingContextType => useContext(SettingsContext)

const SettingsProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [settings, setSettings] = useState<Settings>({})

    useEffect(() => {
        storageService.settings.get().then(conf => {
            if(!conf.currency) {
                conf.currency = Currencies[0]
            }
            setSettings(conf)
        })
    }, [])

    const setSettingsOptions = (settings: Settings) => {
        storageService.settings.save(settings)
        setSettings(settings)
    }

    return (
        <SettingsContext.Provider value={{ 
            settings,
            setSettings: setSettingsOptions,
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsProvider, useSettings }
