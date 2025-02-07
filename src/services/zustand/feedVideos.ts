import { create } from "zustand"
import { FeedVideosSettings } from "../memory/types"
import { getFeedVideoSettings } from "../memory/settings"

interface FeedVideoStore {
    feedSettings: FeedVideosSettings,
    setFeedSettings: (settings: FeedVideosSettings) => void,
    initialize: () => Promise<void>
}

export const useFeedVideosStore = create<FeedVideoStore>((set) => ({
    feedSettings: { 
        FETCH_LIMIT: 100,
        VIDEOS_LIMIT: 30,
        filterTags: ["video", "meme", "memes", "memestr", "nostr"]
    },
    setFeedSettings: (settings: FeedVideosSettings) => {
        set(() => ({
            feedSettings: settings
        }))
    },
    initialize: async () => {
        const settings = await getFeedVideoSettings()
        set(() => ({
            feedSettings: settings
        }))
    }
}))


