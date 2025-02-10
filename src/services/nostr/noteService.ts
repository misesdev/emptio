import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { User } from "../memory/types"
import useNDKStore from "../zustand/ndk"

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

        subscription.on("eose", () => {
            resolve(events)
        })
        subscription.on("close", () => {
            resolve(events)
        }) 
        setTimeout(() => {
            subscription.stop()
            //resolve(events)
        }, timeout)
    })
}
export const noteService = {
    reactNote,
    deleteReact,
    listReactions,
    listComments
}
