import { ItemStorage } from "../base/ItemStorage";
import {  Settings, VideoSettings } from "./types"

export class VideoSettingsStorage extends ItemStorage<VideoSettings> 
{
    constructor() {
        super("videos-settings", {
            FETCH_LIMIT: 500,
            VIDEOS_LIMIT: 30,
            filterTags: [
                "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
            ]
        })
    }
}

export class SettingsStorage extends  ItemStorage<Settings> 
{
    constructor() {
        super("settings", {
            useBiometrics: false,
            currency: {
                code: "USD", 
                label: "currency.label.usd", 
                symbol: "$", 
                flag: "🇺🇸"
            }
        })
    }
}
