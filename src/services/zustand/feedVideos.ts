import { create } from "zustand"
import { FeedVideosSettings } from "../memory/types"
import { storageService } from "../memory"
import { NostrEvent } from "@nostr-dev-kit/ndk-mobile"

interface FeedVideoStore {
    feedSettings: FeedVideosSettings,
    setFeedSettings: (settings: FeedVideosSettings) => void,
    blackList: Set<string>,
    savedEvents: Set<NostrEvent>,
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
    savedEvents: new Set<NostrEvent>([]),
    blackList: new Set<string>([]),
    addOnBlackList: (pubkey: string) => {
        set(state => {
            state.blackList.add(pubkey)
            return { blackList: state.blackList }
        })
    },
    setFeedSettings: (settings: FeedVideosSettings) => {
        set(() => ({
            feedSettings: settings
        }))
    },
    initialize: async () => {
        const blackList = await storageService.settings.blackList.get()
        const feedSettings = await storageService.settings.feedVideos.get()
        const savedEvents = await storageService.database.events.listByCategory("videos") as NostrEvent[]
        set(() => ({
            blackList,
            feedSettings,
            savedEvents: new Set(savedEvents) 
        }))
    }
}))


