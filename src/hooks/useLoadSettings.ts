import { useEffect, useMemo, useState } from "react"
import { AppSettingsStorage } from "@storage/settings/AppSettingsStorage"
import { AppSettings } from "@storage/settings/types"

const useLoadSettings = () => {

    const storage = useMemo(() => new AppSettingsStorage(), [])
    const [settings, setSettings] = useState<AppSettings>({} as AppSettings)
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        const load = async () => await loadSettings()
        load()
    }, [])

    const loadSettings = async () => {
        const settings = await storage.get()
        if(settings)
            setSettings(settings)
        setLoading(false)
    }

    return {
        settings,
        setSettings,
        loading
    }
}

export default useLoadSettings
