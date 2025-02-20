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

const defaultFeedSettings: FeedVideosSettings = { 
    FETCH_LIMIT: 100,
    VIDEOS_LIMIT: 30,
    filterTags: [
        "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
    ]
}

export const getFeedVideoSettings = async () : Promise<FeedVideosSettings> => {

    var settings = defaultFeedSettings

    var data = await AsyncStorage.getItem("feed-videos-settings")

    if(data)
        settings = JSON.parse(data) as FeedVideosSettings

    return settings
}

const defaultBlackList: string[] = [
    "12912202b395d8fbdcef436eea9f4638b8c09fbc064813568e9592685176bc9f",
    "ae8b31f0c09c3ce1d4ea604c395b34b384b592e472f74e180d72307c8af8583c",
    "8eea02e8912085962a930b28beed2683a988614de9a339750ae0b3061e2c6db1",
    "468394f2879efad6e64ae6b6da28d152fd9cc88e2d6796fdb4f4640a43630497",
    "6dba1b837e1479374d5c813048821b39c17553cafce7087c6f3135b33e6f5f14",
    "1fa2141d792409bc67c1a3b0843943968971c265bdf510830a35b48d18df459b"
]

export const getBlackListPubkeys = async (): Promise<Set<string>> => {
    
    var blackList = defaultBlackList

    var data = await AsyncStorage.getItem("black-list-pubkeys")

    if(data)
        blackList = JSON.parse(data) as string[]

    return new Set<string>(blackList)
}

export const addPubkeyOnBlackList = async (pubkey: string) => {
    
    var blackList: string[] = defaultBlackList
    
    var data = await AsyncStorage.getItem("black-list-pubkeys")

    if(data) 
        blackList = JSON.parse(data) as string[]

    blackList.push(pubkey)

    await AsyncStorage.setItem("black-list-pubkeys", JSON.stringify(blackList))
}
