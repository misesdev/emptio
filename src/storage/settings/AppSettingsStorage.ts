import { VideoSettings } from "@services/nostr/types/VideoSettings";
import { ItemStorage } from "../base/ItemStorage";
import { AppSettings } from "./types"

export const defaultVideoSettings: VideoSettings = {
    FETCH_LIMIT: 500,
    VIDEOS_LIMIT: 30,
    filterTags: [
        "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
    ]
}

export class VideoSettingsStorage extends ItemStorage<VideoSettings> 
{
    constructor() {
        super("videos-settings", defaultVideoSettings)
    }
}

export const defaultAppSettings: AppSettings = {
    useBiometrics: false,
    language: { label: "English", selector: "en" },
    currency: {
        code: "USD", 
        label: "currency.label.usd", 
        symbol: "$", 
        flag: "🇺🇸"
    }
}

export class AppSettingsStorage extends  ItemStorage<AppSettings> 
{
    constructor() {
        super("settings", defaultAppSettings)
    }
}
