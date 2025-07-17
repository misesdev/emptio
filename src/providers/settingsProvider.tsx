import { ReactElement, ReactNode, createContext, useContext, useEffect,
    useState } from "react"
import { AppSettingsStorage } from "@storage/settings/AppSettingsStorage"
import { AppSettings } from "@storage/settings/types"
import Currencies from "../constants/Currencies"

interface SettingContextType {
    settings?: AppSettings,
    setSettings?: (settings: AppSettings) => void
}

const SettingsContext = createContext<SettingContextType>({ })

const useSettings = (): SettingContextType => useContext(SettingsContext)

const SettingsProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const _storage = new AppSettingsStorage()
    const [settings, setSettings] = useState<AppSettings>()

    useEffect(() => {
        handleSettingsData()
    }, [])

    const handleSettingsData = async () => {
        const settings = await _storage.get()
        if(settings) setSettings(settings)
    }

    const setSettingsOptions = (settings: AppSettings) => {
        _storage.set(settings) 
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
