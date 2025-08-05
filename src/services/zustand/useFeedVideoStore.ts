import { create } from "zustand"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { VideoSettings } from "../nostr/types/VideoSettings"
import { DataBaseEvents } from "@storage/database/DataBaseEvents"
import { VideoSettingsStorage } from "@storage/settings/AppSettingsStorage"

interface FeedVideoStore {
    feedSettings: VideoSettings,
    setFeedSettings: (settings: VideoSettings) => void,
    blackList: Set<string>,
    savedEvents: Set<NDKEvent>,
    addOnBlackList: (pubkey: string) => void,
    initialize: () => Promise<void>
}

export const useFeedVideosStore = create<FeedVideoStore>((set) => ({
    feedSettings: { 
        FETCH_LIMIT: 500,
        VIDEOS_LIMIT: 30,
        filterTags: [
            "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
        ],
    },
    savedEvents: new Set<NDKEvent>([]),
    blackList: new Set<string>([]),
    addOnBlackList: (pubkey: string) => {
        set(state => {
            state.blackList.add(pubkey)
            return { blackList: state.blackList }
        })
    },
    setFeedSettings: (settings: VideoSettings) => {
        set(() => ({
            feedSettings: settings
        }))
    },
    initialize: async () => {
        const dbEvents = new DataBaseEvents()
        const feedStorage = new VideoSettingsStorage()
        const feedSettings = (await feedStorage.get()) as VideoSettings
        const savedEvents = await dbEvents.listByCategory("videos")
        set(() => ({
            feedSettings,
            savedEvents: new Set(savedEvents) 
        }))
    }
}))


