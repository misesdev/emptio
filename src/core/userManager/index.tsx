import { clearStorage } from "../../services/memory"
import { createPairKeys, getHexKeys } from "../../services/nostr"
import { getUserData, pushUserData, pushUserFollows } from "../../services/nostr/pool"
import { PairKey, User } from "../../services/memory/types"
import { getEvent, listenerEvents, publishEvent } from "../../services/nostr/events"
import { Response, trackException } from "../../services/telemetry"
import { getUser, insertUpdateUser } from "../../services/memory/user"
import { getPairKey, insertPairKey } from "../../services/memory/pairkeys"
import { NostrEventKinds } from "@/src/constants/Events"
import { nip19 } from "nostr-tools"
import env from "@/env"
import NDK, { NostrEvent } from "@nostr-dev-kit/ndk"

type SignUpProps = { 
    userName: string, 
    setUser?: (user: User) => void, 
    setFollowsEvent?: (event: NostrEvent) => void  
}

const signUp = async ({ userName, setUser, setFollowsEvent }: SignUpProps): Promise<Response<any>> => {
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
        if (setFollowsEvent) setFollowsEvent(followsEvent)

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type SignProps = { 
    secretKey: string, 
    setUser?: (user: User) => void,
    setFollowsEvent?: (event: NostrEvent) => void
}

const signIn = async ({ secretKey, setUser, setFollowsEvent }: SignProps) => {

    try {
        const pairKey: PairKey = getHexKeys(secretKey)

        const userData = await getUserData(pairKey.publicKey)

        const followsEvent = await getEvent({ 
            kinds: [NostrEventKinds.followList],
            authors: [pairKey.publicKey],
            limit: 1
        })

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        await insertPairKey(pairKey)

        if (setUser) setUser(userData)
        if (setFollowsEvent) setFollowsEvent(followsEvent as NostrEvent)

        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
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

        if (event) {
            user.picture = event.content?.picture
            user.image = event.content?.image
            user.banner = event.content?.banner
            user.lud06 = event.content?.lud06
            user.lud16 = event.content?.lud16
            user.nip05 = event.content?.nip05
            user.bio = event.content?.bio
            user.name = event.content?.name
            user.website = event.content?.website
            user.about = event.content?.about
            user.zapService = event.content?.zapService
            user.bitcoin_address = event.content?.bitcoin_address
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

        await clearStorage()

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type loggedProps = {
    setUser?: (user: User) => void
}

const isLogged = async ({ setUser }: loggedProps) => {

    try 
    {
        const user: User = await getUser()

        const { publicKey, privateKey } = await getPairKey(user.keychanges ?? "")

        user.pubkey = publicKey

        if (setUser && !!privateKey)
            setUser(user)

        return !!privateKey
    } 
    catch { return false }
}

const listFollows = async (user: User,  followsEvent: NostrEvent, iNot: boolean = true): Promise<User[]> => {

    var follows: User[] = []

    try {
        // const response = await fetch(`${env.nosbook.api}/user/friends/${user.pubkey}`)

        // const events = await response.json();
        const authors = followsEvent.tags.filter(t => t[0] == "p").map(t => t[1])

        const events = await listenerEvents({ authors, kinds: [0], limit: authors.length })

        follows = events.filter((u: any) => u.pubkey != user.pubkey).map((user: any): User => {
            // return {
            //     name: user.name,
            //     pubkey: user.pubkey,
            //     picture: user.profile,
            //     display_name: user.displayName,
            // }
            return user.content as User
        })
    } catch (fail) {
        //console.log("error when loading folows", fail)
        return []
    }

    if (iNot) 
        return follows.filter(follow => follow.pubkey != user.pubkey) 

    return follows
}

type addFollowProps = {
    user: User,
    friend: User,
    followsEvent: NostrEvent
}

const addFollow = async ({ user, friend, followsEvent }: addFollowProps) => {
    try {

        await fetch(`${env.nosbook.api}/friends/add`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pubkey: user.pubkey,
                friends: [friend.pubkey]
            })
        })
        
        const pairKey = await getPairKey(user.keychanges ?? "")

        await publishEvent(followsEvent, pairKey, true)
    }
    catch (ex) { console.log(ex) }
}

const removeFollow = async ({ user, friend, followsEvent }: addFollowProps) => {
    try {
        // await fetch(`${env.nosbook.api}/friends/remove`, {
        //     method: "post",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         pubkey: user.pubkey,
        //         friends: [friend.pubkey]
        //     })
        // })
        
        const pairKey = await getPairKey(user.keychanges ?? "")

        followsEvent.created_at = Date.now()

        await publishEvent(followsEvent, pairKey, true)
    } 
    catch (ex) { console.log(ex) }
}

const createFollowEvent = (user: User, friends: [string[]]) : NostrEvent => {

    const pool = Nostr as NDK

    return {
        pubkey: user.pubkey ?? "",
        kind: NostrEventKinds.followList,
        content: JSON.stringify(pool.explicitRelayUrls),
        created_at: Date.now(),
        tags: friends
    }
}

const searchUsers = async (user: User, searchTerm: string, limit: number = 50): Promise<User[]> => {
    try 
    {
        const response = await fetch(`${env.nosbook.api}/search`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pubkey: user.pubkey,
                searchTerm: searchTerm,
                limit
            })
        })

        const users: any = await response.json()

        return users.filter((u: any) => u.pubkey != user.pubkey).map((user: any) => {
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

const lastNotes = async (user: User, limit: number = 3, onlyPrincipal = false) : Promise<string[]> => {

    var events = await listenerEvents({ 
        authors: [user.pubkey ?? ""], 
        kinds: [1], 
        limit: limit
    })

    if(onlyPrincipal) 
        events = events.filter(e => !e.tags?.filter(t => t[0] == "e").length)

    return events.sort((a,b) => (a.created_at ?? 1) - (b.created_at ?? 1))
        .map(event => event.content as string)
}

const listChats = async (followsEvent: NostrEvent): Promise<NostrEvent[]> => {
    
    const eventsChat = await listenerEvents({ kinds: [4], "#p": [followsEvent.pubkey ?? ""] })

    return eventsChat as NostrEvent[]
}

const convertPubkey = (pubkey: string) => nip19.npubEncode(pubkey)

export const userService = {
    signUp,
    signIn,
    signOut,
    isLogged,
    getUser: getUser,
    updateProfile,
    convertPubkey,
    listFollows,
    addFollow,
    removeFollow,
    searchUsers,
    lastNotes,
    listChats,
    createFollowEvent
}
