import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { FeedVideosSettings, User } from "../memory/types"
import useNDKStore from "../zustand/ndk"
import { extractVideoUrl } from "@/src/utils"
import { pushMessage } from "../notification"

const ndk = useNDKStore.getState().ndk

interface ListReactionProps { user: User, note: NDKEvent }

const listReactions = async ({ user, note }: ListReactionProps): Promise<NDKEvent[]> => {

    const filter: NDKFilter = { authors:[user.pubkey??""], kinds:[7], "#e": [note.id] }

    const events = await ndk.fetchEvents(filter, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    return Array.from(events)
}

type ReactionProps = { note: NDKEvent, reaction: string }

const reactNote = async ({ note, reaction }: ReactionProps): Promise<NDKEvent>=> {
    note.ndk = ndk
    return await note.react(reaction)
}

const deleteReact = async (note: NDKEvent): Promise<NDKEvent> => {
    note.ndk = ndk
    return await note.delete()
}

const listComments = async (event: NDKEvent, timeout: number=500) : Promise<NDKEvent[]> => {

    return new Promise<NDKEvent[]>((resolve) => {
        try {
            const events: NDKEvent[] = []
        
            const filter: NDKFilter = { 
                kinds: [1], "#p": [event.pubkey], "#e": [event.id] 
            }
            
            const subscription = ndk.subscribe(filter, { 
                cacheUsage: NDKSubscriptionCacheUsage.PARALLEL 
            })
            
            subscription.on("event", note => {
                events.push(note)
            })

            const finish = () => resolve(events)

            subscription.on("eose", finish)
            subscription.on("close", finish) 

            setTimeout(() => {
                subscription.stop()
            }, timeout)
        }
        catch(ex) {
            console.log(ex)
            resolve([]) 
        }
    })
}


interface SubscriptionVideosProps {
    videos: NDKEvent[],
    feedSettings: FeedVideosSettings
}

interface VideoControlsProps {
    lastTimestamp?: number
}

const videoControlls : VideoControlsProps = {
    lastTimestamp: undefined
}

const subscriptionVideos = async ({ videos, feedSettings }: SubscriptionVideosProps) : Promise<Set<NDKEvent>> => {

    return new Promise((resolve) => {
        var timeout: any = null

        const filter: NDKFilter = {
            until: videoControlls.lastTimestamp, 
            kinds: [1, 1063], "#t": feedSettings.filterTags, 
        }

        const subscription = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        })

        const newerEvents: Set<NDKEvent> = new Set()
        
        subscription.on("event", event => {
            if(newerEvents.size >= feedSettings.VIDEOS_LIMIT) {
                return subscription.stop()
            }
            videoControlls.lastTimestamp = event.created_at
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

export const noteService = {
    reactNote,
    deleteReact,
    listReactions,
    listComments,
    subscriptionVideos
}
