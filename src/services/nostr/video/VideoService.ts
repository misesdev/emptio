import NDK, { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { IVideoService, SubscriptionVideosProps, VideoControlsProps } from "./IVideoService"
import { pushMessage } from "../../notification";
import { extractVideoUrl } from "@/src/utils";
import useNDKStore from "../../zustand/useNDKStore";

class VideoService implements IVideoService 
{
    private readonly _ndk: NDK;
    private readonly _controls: VideoControlsProps;
   
    constructor() {
        this._ndk = useNDKStore.getState().ndk
        this._controls = {
            lastTimestamp: undefined
        } 
    }

    public async subscription({ videos, feedSettings }: SubscriptionVideosProps): Promise<Set<NDKEvent>> {
        return new Promise((resolve) => {
            var timeout: any = null

            const filter: NDKFilter = {
                until: this._controls.lastTimestamp, 
                kinds: [1, 1063], "#t": feedSettings.filterTags, 
            }

            const subscription = this._ndk.subscribe(filter, { 
                cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
            })

            const newerEvents: Set<NDKEvent> = new Set()
            
            subscription.on("event", event => {
                if(newerEvents.size >= feedSettings.VIDEOS_LIMIT) {
                    return subscription.stop()
                }
                this._controls.lastTimestamp = event.created_at
                const url = extractVideoUrl(event.content)
                if(url && !videos.find(e => e.id == event.id)) 
                {
                    const videoIds = new Set(videos.map(e => e.id))
                    if(!videoIds.has(event.id))
                        newerEvents.add(event)
                }
            })

            const finish = () => {
                if(newerEvents.size <= 0) pushMessage("nenhum vídeo novo encotrado")
                if(timeout) clearTimeout(timeout)
                resolve(newerEvents)
            }
            
            subscription.on("close", finish)
            subscription.on("eose", finish)

            subscription.start()    
            
            timeout = setTimeout(() => {
                subscription.stop()
            }, 5000)
        })
    }
}

export default VideoService
