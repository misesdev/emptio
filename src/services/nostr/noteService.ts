import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { User } from "../memory/types"
import useNDKStore from "../zustand/ndk"
import { useFeedVideosStore } from "../zustand/feedVideos"
import { extractVideoUrl } from "@/src/utils"

const ndk = useNDKStore.getState().ndk

type ListReactionProps = {
    user: User,
    note: NDKEvent
}
const listReactions = async ({ user, note }: ListReactionProps): Promise<NDKEvent[]> => {

    const filter: NDKFilter = { authors:[user.pubkey??""], kinds:[7], "#e": [note.id] }

    const events = await ndk.fetchEvents(filter, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    return Array.from(events)
}

type ReactionProps = {
    note: NDKEvent,
    reaction: string
}
const reactNote = async ({ note, reaction }: ReactionProps): Promise<void>=> {
    note.ndk = ndk
    await note.react(reaction)
}

const deleteReact = async (note: NDKEvent): Promise<void> => {
    note.ndk = ndk
    await note.delete()
}

const listComments = async (event: NDKEvent, timeout: number=500) :Promise<NDKEvent[]> => {

    return new Promise((resolve) => {
        const events: NDKEvent[] = []
        
        const filter: NDKFilter = { 
            kinds: [1], "#e": [event.id], since: event.created_at, limit: 10
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
    })
}


interface SubscriptionVideosProps {
    videos: NDKEvent[]
}

interface VideoControlsProps {
    isFetching: boolean, lastTimestamp?: number
}

const videoControlls : VideoControlsProps = {
    isFetching: false, lastTimestamp: undefined
}

const subscriptionVideos = async ({ videos }: SubscriptionVideosProps) : Promise<NDKEvent[]> => {

    const feedSettings = useFeedVideosStore.getState().feedSettings

    return new Promise((resolve) => {
        if(videoControlls.isFetching) return
      
        videoControlls.isFetching = true
        console.log("fetching events")

        const filter: NDKFilter = {
            until: videoControlls.lastTimestamp, 
            kinds: [1, 1063], "#t": feedSettings.filterTags, 
            //limit: feedSettings.FETCH_LIMIT
        }

        const subscription = ndk.subscribe(filter, { 
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
        })

        const newerEvents: NDKEvent[] = []
        subscription.on("event", event => {
            if(newerEvents.length >= feedSettings.VIDEOS_LIMIT) {
                return subscription.stop()
            }
            videoControlls.lastTimestamp = event.created_at
            const url = extractVideoUrl(event.content)
            if(url && !videos.find(e => e.id == event.id)) {
                newerEvents.push(event)
            }
        })

        const finish = () => {
            setTimeout(() => { 
                videoControlls.isFetching = false
                resolve([...videos, ...newerEvents])
            }, 20)
            console.log("close")
        }
        
        subscription.on("close", finish)
        subscription.on("eose", finish)

        subscription.start()    
        
        setTimeout(() => {
            subscription.stop()
        }, 3000)
    })
}

export const noteService = {
    reactNote,
    deleteReact,
    listReactions,
    listComments,

    subscriptionVideos
}
