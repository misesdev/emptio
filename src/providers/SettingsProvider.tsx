import { ReactElement, ReactNode, createContext, useContext, useEffect,
    useState } from "react"
import { AppSettingsStorage, defaultAppSettings } from "@storage/settings/AppSettingsStorage"
import { AppSettings } from "@storage/settings/types"

interface SettingContextType {
    settings: AppSettings,
    setSettings: (settings: AppSettings) => void
}

const SettingsContext = createContext<SettingContextType|null>(null)

const useSettings = (): SettingContextType => {
    const context = useContext(SettingsContext)
    if(!context)
        throw new Error("SettingsContext not found")
    return context
}

const SettingsProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const _storage = new AppSettingsStorage()
    const [settings, setSettings] = useState<AppSettings>(defaultAppSettings)

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
