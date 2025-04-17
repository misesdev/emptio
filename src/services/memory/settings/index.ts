import AsyncStorage from "@react-native-async-storage/async-storage"
import { FeedVideosSettings, Settings } from "../types";

export class SettingsStorage {
    
    protected static defaultFeedSettings: FeedVideosSettings = { 
        FETCH_LIMIT: 500,
        VIDEOS_LIMIT: 30,
        filterTags: [
            "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
        ]
    }

    protected static defaultBlackList: string[] = [
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
        "db618c25d6bc4d0730308f55a5d5c43da00b48c0fd3fcb0ba1efa03955b3574d",
        "67a73664ad08bd2d681d6bf6a8557efa89cd639376d45f616a703cccfbfdca2a",
        "25646a322579d6bb264bab4481b1e302c0a7986648f96298983b459235a4c2b6",
        "d7c82cce3509f24287f8c100ba8824bcf012194f49f290f001b1cf88dd58bf19",
        "94d6e743e074937a044cfcb37c5c536c01ff17204087220d6c08cfd763e81524",
        "c4c4def7ba88dbd0560797f4f8e2e81acab0fe5bd5380c94429ba763d46faae2",
        "25129977b8047f3ee1a27583449bcd0009ed513da78e75b4177ebdbb7c7695f9"
    ]

    private static defaultSettings: Settings = {
        useBiometrics: false,
        currency: {
            code: "USD", 
            label: "currency.label.usd", 
            symbol: "$", 
            flag: "🇺🇸"
        }
    }

    static async get() : Promise<Settings> {
        let settings: Settings = this.defaultSettings 
        let data = await AsyncStorage.getItem("settings")
        if(data)
            settings = JSON.parse(data) as Settings
        return settings
    }

    static async save(settings: Settings) : Promise<void> {
        await AsyncStorage.setItem("settings", JSON.stringify(settings))
    }

    public static feedVideos = {
        get: async () => {
            let settings = this.defaultFeedSettings
            let data = await AsyncStorage.getItem("feed-videos-settings")
            if(data)
                settings = JSON.parse(data) as FeedVideosSettings
            return settings
        },
        save: async (settings: FeedVideosSettings) => {
            await AsyncStorage.setItem("feed-videos-settings", JSON.stringify(settings))
        }
    }

    public static blackList = {
        add: async (pubkey: string) => {
            let blackList: string[] = this.defaultBlackList
            let data = await AsyncStorage.getItem("black-list-pubkeys")
            if(data) 
                blackList = JSON.parse(data) as string[]
            blackList.push(pubkey)
            await AsyncStorage.setItem("black-list-pubkeys", JSON.stringify(blackList))
        },
        get: async () => {
            let blackList = this.defaultBlackList
            let data = await AsyncStorage.getItem("black-list-pubkeys")
            if(data)
                blackList = JSON.parse(data) as string[]
            return new Set<string>(blackList)
        }
    }
}

