import { getItem, setItem } from "expo-secure-store";
import { Settings } from "./types";

export const saveSettings = (settings: Settings) => setItem("settings", JSON.stringify(settings))

export const getSettings = (): Settings => {

    var settings: Settings = { useBiometrics: false }

    var data = getItem("settings")

    if(data)
        settings = JSON.parse(data) as Settings

    return settings
}
