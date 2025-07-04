import { storageService } from "@services/memory"
import { getEvent, listenerEvents, publishEvent, NostrEvent } from "@services/nostr/events"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { EventKinds } from "@src/constants/Events"
import useNDKStore from "@services/zustand/ndk"
import { nip19 } from "nostr-tools"
import { timeSeconds } from "@services/converter"

interface UpdateProfileProps {
    user: User;
    setUser?: (user: User) => void;
    upNostr?: boolean;
}

const updateProfile = async ({ user, setUser, upNostr = false }: UpdateProfileProps) => {
    if (!upNostr) 
    {
        const event = await getEvent({ 
            kinds: [EventKinds.metadata], 
            authors: [user.pubkey ?? ""]
        })

        if (event) 
        {
            const userData = event.content as User
            user.picture = userData?.picture
            user.image = userData?.image
            user.banner = userData?.banner
            user.lud06 = userData?.lud06
            user.lud16 = userData?.lud16
            user.nip05 = userData?.nip05
            user.bio = userData?.bio
            user.name = userData?.name
            user.website = userData?.website
            user.about = userData?.about
            user.zapService = userData?.zapService
            user.bitcoin_address = userData?.bitcoin_address
        }
    } else {
        const pairkey = await storageService.secrets.getPairKey(user.keychanges ?? "")
        
        await publishEvent({ 
            kind: EventKinds.metadata,
            content: JSON.stringify(user)
        }, pairkey)
    }

    await storageService.user.save(user)

    if (setUser) setUser(user)
}

const listFollows = async (user: User, follows?: NostrEvent, iNot: boolean = true): Promise<User[]> => {
    var friends: User[] = []
    try {
        const authors = follows?.tags?.filter(t => t[0] == "p").map(t => t[1])
        const events = await listenerEvents({ authors, kinds: [0], limit: authors?.length })
        friends = Array.from(events).filter((u: NostrEvent) => u.pubkey != user.pubkey).map((event: NostrEvent): User => {
            const follow = event.content as User
            follow.pubkey = event.pubkey
            return follow
        })
    } 
    catch {
        return []
    }

    if (iNot) 
        return friends.filter(follow => follow.pubkey != user.pubkey) 

    return friends
}

interface UpdateFollowsProps {
    user: User;
    follows?: NostrEvent;
}

const updateFollows = async ({ user, follows } : UpdateFollowsProps) => {
    try {
        const pairKey = await storageService.secrets.getPairKey(user.keychanges ?? "")
        if(follows) await publishEvent(follows, pairKey, true)
    } 
    catch {  }
}

export const createFollowEvent = (user: User, friends: [string[]]) : NostrEvent => {
    const ndk = useNDKStore.getState().ndk
    return {
        pubkey: user.pubkey ?? "",
        kind: EventKinds.followList,
        content: JSON.stringify(ndk.explicitRelayUrls),
        created_at: timeSeconds.now(),
        tags: friends
    }
}

const searchUsers = async (user: User, searchTerm: string, limit: number = 50): Promise<User[]> => {
    try 
    {
        let defaultPubkey = process.env.DEFAULT_PUBKEY 
        const response = await fetch(`${process.env.NOSBOOK_API_URL}/search`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pubkey: user.pubkey ?? defaultPubkey,
                searchTerm,
                limit
            })
        })

        if(!response.ok) 
            throw new Error("an unexpected error occurred during the request")
        
        const users: any = await response.json()
        return users.filter((u: any) => u.pubkey != user.pubkey)
            .sort((a:any, b:any) => (b.similarity ?? 1) - (a.similarity ?? 1))
            .map((user: any) => {
                return {
                    name: user.name,
                    pubkey: user.pubkey,
                    picture: user.profile,
                    display_name: user.displayName
                }
            })
    }
    catch {
        return [] 
    }
}

const lastNotes = async (user: User, limit: number = 3) : Promise<NDKEvent[]> => {
    try {
        const ndk = useNDKStore.getState().ndk
        const filter: NDKFilter = { kinds: [1], authors: [user.pubkey??""], limit }
        const events = await ndk.fetchEvents(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST 
        })
        return Array.from(events)
            .filter(e => !e.tags.filter(t => t[0] == "e").length)
            // .filter(e => e.content.length > 0)
    } 
    catch { return [] }
}

const listUsers = async (pubkeys: string[]): Promise<User[]> => {
    const users: User[] = []
    const events = await listenerEvents({ kinds: [0], authors: pubkeys, limit: pubkeys.length })
    events.forEach(event => {
        const user = event.content as User
        user.pubkey = event.pubkey
        users.push(user)
    })
    return users
}

const getProfile = async (pubkey: string) => {
    const event = await getEvent({
        authors: [pubkey], 
        kinds: [EventKinds.metadata], 
        limit: 1 
    })
    const user = event?.content as User
    user.pubkey = pubkey
    return user
}

const convertPubkey = (pubkey: string) => nip19.npubEncode(pubkey)

const getUser = () => storageService.user.get()

export const userService = {
    getUser,
    getProfile,
    updateProfile,
    convertPubkey,
    listFollows,
    updateFollows,
    searchUsers,
    lastNotes,
    listUsers,
    createFollowEvent
}
