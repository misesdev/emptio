import { clearStorage } from "@services/memory"
import { createPairKeys, getHexKeys } from "@services/nostr"
import { getUserData, pushUserData, pushUserFollows } from "@services/nostr/pool"
import { getEvent, listenerEvents, publishEvent, NostrEvent } from "@services/nostr/events"
import { NDKEvent, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { Response, trackException } from "@services/telemetry"
import { getUser, insertUpdateUser } from "@services/memory/user"
import { getPairKey, insertPairKey } from "@services/memory/pairkeys"
import { clearEvents } from "@services/memory/database/events"
import { NostrEventKinds } from "@/src/constants/Events"
import { PairKey, User } from "@services/memory/types"
import useNDKStore from "@services/zustand/ndk"
import { nip19 } from "nostr-tools"
import useChatStore from "@/src/services/zustand/chats"

type SignUpProps = { 
    userName: string, 
    setUser?: (user: User) => void,  
    setFollows?: (event: NostrEvent) => void  
}

const signUp = async ({ userName, setUser, setFollows }: SignUpProps): Promise<Response<User|null>> => {
    try {        
        const pairKey: PairKey = createPairKeys()

        const userData: User = {
            name: userName.trim(),
            pubkey: pairKey.publicKey,
            display_name: userName.trim(),
            keychanges: pairKey.key,
        }

        const followsEvent = createFollowEvent(userData, [[]])

        await pushUserData(userData, pairKey)

        await pushUserFollows(followsEvent, pairKey)

        await insertUpdateUser(userData)
        
        await insertPairKey(pairKey)

        if (setUser) setUser(userData)
        if (setFollows) setFollows(followsEvent)

        return { success: true, data: userData }
    }
    catch (ex) {
        return trackException(ex, null)
    }
}

type SignProps = { 
    secretKey: string, 
    setUser?: (user: User) => void,
    setFollows?: (event: NostrEvent) => void
}

const signIn = async ({ secretKey, setUser, setFollows }: SignProps) : Promise<Response<User|null>>=> {
    try {
        const pairKey: PairKey = getHexKeys(secretKey)

        const userData = await getUserData(pairKey.publicKey)

        const follows = await getEvent({ 
            kinds: [NostrEventKinds.followList],
            authors: [pairKey.publicKey],
            limit: 1
        })

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        await insertPairKey(pairKey)

        if (setUser) setUser(userData)
        if (setFollows) setFollows(follows)

        return { success: true, data: userData }
    }
    catch (ex) {
        return trackException(ex, null)
    }
}

type UpdateProfileProps = {
    user: User,
    setUser?: (user: User) => void,
    upNostr?: boolean
}

const updateProfile = async ({ user, setUser, upNostr = false }: UpdateProfileProps) => {

    if (!upNostr) {
        const event = await getEvent({ kinds: [NostrEventKinds.metadata], authors: [user.pubkey ?? ""] })

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
        const pairkey = await getPairKey(user.keychanges ?? "")
        
        await publishEvent({ 
            kind: NostrEventKinds.metadata,
            content: JSON.stringify(user)
        }, pairkey)
    }

    await insertUpdateUser(user)

    if (setUser)
        setUser(user)
}

const signOut = async (): Promise<Response<any>> => {
    try {
        await clearEvents()
        await clearStorage()
        useChatStore.getState().setChats([])
        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type loggedProps = {
    setUser?: (user: User) => void
}

const isLogged = async ({ setUser }: loggedProps) : Promise<Response<User|null>> => {
    try {
        const user: User = await getUser()

        const pairKey = await getPairKey(user.keychanges ?? "")

        user.pubkey = pairKey.publicKey

        if (setUser && !!pairKey.privateKey)
            setUser(user)

        return { success: !!pairKey.privateKey, data: user }
    } 
    catch(ex) { 
        return trackException(ex, null)
    }
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
    } catch {
        return []
    }

    if (iNot) 
        return friends.filter(follow => follow.pubkey != user.pubkey) 

    return friends
}

type UpdateFollowsProps = {
    user: User,
    follows?: NostrEvent
}

const updateFollows = async ({ user, follows } : UpdateFollowsProps) => {
    try {
        const pairKey = await getPairKey(user.keychanges ?? "")

        if(follows)
            await publishEvent(follows, pairKey, true)
    } 
    catch {  }
}

const createFollowEvent = (user: User, friends: [string[]]) : NostrEvent => {

    const ndk = useNDKStore.getState().ndk

    return {
        pubkey: user.pubkey ?? "",
        kind: NostrEventKinds.followList,
        content: JSON.stringify(ndk.explicitRelayUrls),
        created_at: Date.now(),
        tags: friends
    }
}

const searchUsers = async (user: User, searchTerm: string, limit: number = 50): Promise<User[]> => {
    try 
    {
        const response = await fetch(`${process.env.NOSBOOK_API_URL}/search`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pubkey: user.pubkey,
                searchTerm: searchTerm,
                limit
            })
        })

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
    catch { return [] }
}

const lastNotes = async (user: User, limit: number = 3) : Promise<NDKEvent[]> => {
    try {
        const ndk = useNDKStore.getState().ndk

        const events = await ndk.fetchEvents({
            authors: [user.pubkey ?? ""],
            kinds: [1],
            limit: limit,
        }, { cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST })
        
        return Array.from(events)
            .filter(e => !e.tags.filter(t => t[0] == "e").length)
            .filter(e => e.content.length > 0)
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
   
    const event = await getEvent({ authors: [pubkey], kinds:[0], limit: 1 })

    const user = event.content as User

    user.pubkey = pubkey

    return user
}

const convertPubkey = (pubkey: string) => nip19.npubEncode(pubkey)

export const userService = {
    signUp,
    signIn,
    signOut,
    isLogged,
    getUser: getUser,
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
