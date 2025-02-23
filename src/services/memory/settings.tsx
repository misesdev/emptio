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
    FETCH_LIMIT: 500,
    VIDEOS_LIMIT: 50,
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
    "1fa2141d792409bc67c1a3b0843943968971c265bdf510830a35b48d18df459b",
    "cda85b4f5c6442f071a7f0c951234860abf19dacada83333a8e5f996f5e5fe77",
    "7f18aff53c26d7ae8e50505e01b81dad42350c895496cd997a68e6492cf4e24c",
    "1a7b63ae3a6ef47456237e4e005273a9eadffd600c1afe2d69c5490cfced0448",
    "cbc8c59b9b07fa774c2de0228729236678aee3d5a1f7388796cdc3a6f65991db",
    "db618c25d6bc4d0730308f55a5d5c43da00b48c0fd3fcb0ba1efa03955b3574d"
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
