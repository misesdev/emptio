import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { getSettings, saveSettings } from "@services/memory/settings"
import { Settings } from "@services/memory/types"

type SettingContextType = {
    settings: Settings,
    setSettings?: (settings: Settings) => void
}

const SettingsContext = createContext<SettingContextType>({ settings: {} })

const useSettings = (): SettingContextType => useContext(SettingsContext)

const SettingsProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [settings, setSettings] = useState<Settings>({})

    useEffect(() => {
        getSettings().then(setSettings)
    })

    const setSettingsOptions = (settings: Settings) => {
        saveSettings(settings)
        setSettings(settings)
    }

    return (
        <SettingsContext.Provider value={{ settings, setSettings: setSettingsOptions }}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsProvider, useSettings }
