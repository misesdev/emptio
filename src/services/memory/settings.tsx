import AsyncStorage from "@react-native-async-storage/async-storage"
import { Settings } from "./types";

export const saveSettings = async (settings: Settings) => {
    await AsyncStorage.setItem("settings", JSON.stringify(settings))
}

export const getSettings = async () : Promise<Settings> => {

    var settings: Settings = { useBiometrics: false }

    var data = await AsyncStorage.getItem("settings")

    if(data)
        settings = JSON.parse(data) as Settings

    return settings
}
