import { clearStorage } from "../../services/memory"
import { createPairKeys, getHexKeys } from "../../services/nostr"
import { getUserData, pushUserData } from "../../services/nostr/pool"
import { PairKey, User } from "../../services/memory/types"
import { getEvent, listenerEvents } from "../../services/nostr/events"
import { Response, trackException } from "../../services/telemetry"
import { getUser, insertUpdateUser } from "../../services/memory/user"
import { getPairKey, insertPairKey } from "../../services/memory/pairkeys"
import { NostrEventKinds } from "@/src/constants/Events"
import { nip19 } from "nostr-tools"

type SignUpProps = {
    userName: string,
    setUser?: (user: User) => void
}

const signUp = async ({ userName, setUser }: SignUpProps): Promise<Response> => {
    try {

        const pairKey: PairKey = createPairKeys()

        const userData: User = {
            name: userName.trim(),
            displayName: userName.trim(),
            keychanges: pairKey.key,
        }

        await pushUserData(userData, pairKey)

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        if (setUser)
            setUser(userData)

        return { success: true, message: "" }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type SignProps = {
    secretKey: string,
    setUser?: (user: User) => void
}

const signIn = async ({ secretKey, setUser }: SignProps) => {

    try {
        const pairKey: PairKey = getHexKeys(secretKey)

        const userData = await getUserData(pairKey.publicKey)

        userData.keychanges = pairKey.key

        await insertUpdateUser(userData)

        await insertPairKey(pairKey)

        if (setUser)
            setUser(userData)

        return { success: true }
    }
    catch (ex) {
        return trackException(ex)
    }
}

type UpdateProfileProps = {
    user: User,
    setUser?: (user: User) => void
}

const updateProfile = async ({ user, setUser }: UpdateProfileProps) => {

    const event = await getEvent({ limit: 2, kinds: [NostrEventKinds.metadata], authors: [user.pubkey ?? ""] })

    if (event) {
        user.displayName = event.content?.displayName
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
    }

    await insertUpdateUser(user)

    if (setUser)
        setUser(user)
}

const signOut = async (): Promise<Response> => {

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

    const user: User = await getUser()

    const { publicKey, privateKey } = await getPairKey(user.keychanges ?? "")

    user.pubkey = publicKey

    if (setUser && !!privateKey)
        setUser(user)

    return !!privateKey
}

const listFollows = async (user: User, iNot: boolean = true): Promise<User[]> => {

    var follows: User[] = []

    const event = await getEvent({ limit: 1, authors: [user.pubkey ?? ""], kinds: [NostrEventKinds.followList] })

    // if (events[0]?.content) {
    //     for (let relay in events[0].content) {
    //         if (relay.includes("wss://")) 
    //             Nostr.addExplicitRelay(relay)
    //     }
    // }

    follows = event ? event.tags.map(tag => { return { pubkey: tag[1] } }) : []

    follows = follows.filter(f => (f.pubkey ?? "").length >= 64)

    if (iNot) 
    {
        return follows.filter(pubkey => pubkey != user.pubkey).map(follow => {
            follow.name = convertPubkey(follow.pubkey ?? "")
            return follow
        })
    }

    return follows.map(follow => {
        follow.name = convertPubkey(follow.pubkey ?? "")
        return follow
    })
}

const convertPubkey = (pubkey: string) => nip19.npubEncode(pubkey)

export const userService = {
    signUp,
    signIn,
    signOut,
    isLogged,
    updateProfile,
    convertPubkey,
    listFollows
}