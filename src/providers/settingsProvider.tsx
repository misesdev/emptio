import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { getFeedVideoSettings, getSettings, saveFeedVideoSettings, saveSettings } from "@services/memory/settings"
import { FeedVideosSettings, Settings } from "@services/memory/types"

type SettingContextType = {
    settings: Settings,
    setSettings?: (settings: Settings) => void
    feedVideos?: FeedVideosSettings,
    setFeedVideos?: (settings: FeedVideosSettings) => void
}

const SettingsContext = createContext<SettingContextType>({ settings: {} })

const useSettings = (): SettingContextType => useContext(SettingsContext)

const SettingsProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [settings, setSettings] = useState<Settings>({})
    const [feedVideos, setFeedVideos] = useState<FeedVideosSettings>()

    useEffect(() => {
        getSettings().then(setSettings)
        getFeedVideoSettings().then(setFeedVideos)
    })

    const setSettingsOptions = (settings: Settings) => {
        saveSettings(settings)
        setSettings(settings)
    }

    const setFeedVideosOptions = (settings: FeedVideosSettings) => {
        saveFeedVideoSettings(settings)
        setFeedVideos(settings)
    }

    return (
        <SettingsContext.Provider value={{ 
            settings,
            setSettings: setSettingsOptions,
            feedVideos,
            setFeedVideos: setFeedVideosOptions
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsProvider, useSettings }
