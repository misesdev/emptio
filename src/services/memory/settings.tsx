import AsyncStorage from "@react-native-async-storage/async-storage"
import { FeedVideosSettings, Settings } from "./types";

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

export const saveFeedVideoSettings = async (settings: FeedVideosSettings) => {
    await AsyncStorage.setItem("feed-videos-settings", JSON.stringify(settings))
}

export const getFeedVideoSettings = async () : Promise<FeedVideosSettings> => {

    var settings: FeedVideosSettings = { 
        FETCH_LIMIT: 100,
        VIDEOS_LIMIT: 30,
        filterTags: [
            "video", "meme", "memes", "memestr", "nostr"
        ]
    }

    var data = await AsyncStorage.getItem("feed-videos-settings")

    if(data)
        settings = JSON.parse(data) as FeedVideosSettings

    return settings
}
