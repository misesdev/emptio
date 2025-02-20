import { create } from "zustand"
import { FeedVideosSettings } from "../memory/types"
import { getBlackListPubkeys, getFeedVideoSettings } from "../memory/settings"

interface FeedVideoStore {
    feedSettings: FeedVideosSettings,
    setFeedSettings: (settings: FeedVideosSettings) => void,
    blackList: Set<string>,
    addOnBlackList: (pubkey: string) => void,
    initialize: () => Promise<void>
}

export const useFeedVideosStore = create<FeedVideoStore>((set) => ({
    feedSettings: { 
        FETCH_LIMIT: 100,
        VIDEOS_LIMIT: 50,
        filterTags: [
            "video", "meme", "memestr", "nostr", "news", "animalstr", "animal", "bitcoin"
        ]
    },
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
        const blackList = await getBlackListPubkeys()
        const settings = await getFeedVideoSettings()
        set(() => ({
            blackList: blackList,
            feedSettings: settings
        }))
    }
}))


