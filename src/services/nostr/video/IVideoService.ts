import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { FeedVideosSettings } from "../../memory/types"

export interface SubscriptionVideosProps {
    videos: NDKEvent[],
    feedSettings: FeedVideosSettings
}

export interface VideoControlsProps {
    lastTimestamp?: number
}

export interface IVideoService {
    subscription(props: SubscriptionVideosProps): Promise<Set<NDKEvent>>; 
}
