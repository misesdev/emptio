import NDK, { NDKCacheAdapterSqlite, NDKFilter, NDKPrivateKeySigner, 
    NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { PairKey, User } from "../memory/types"
import { publishEvent, NostrEvent, getEvent } from "./events"
import { getRelays } from "../memory/relays"
import { getPairKey } from "../memory/pairkeys"
import { AppState } from "react-native"
import { ChatUser } from "../zustand/chats"
import useNDKStore from "../zustand/ndk"
import { NostrEventKinds } from "@/src/constants/Events"
import { processEventMessage } from "./processEvents"

export const getUserData = async (publicKey: string): Promise<User> => {

    const event = await getEvent({ 
        authors: [publicKey], 
        kinds: [NostrEventKinds.metadata], 
        limit: 1 
    })

    return event.content as User
}

export const pushUserData = async (user: User, pairKey: PairKey) => {

    const profile: User = {
        name: user.name,
        display_name: user.display_name,
        picture: user.picture,
        image: user.image,
        about: user.about,
        bio: user.bio,
        nip05: user.nip05,
        lud06: user.lud06,
        lud16: user.lud16,
        banner: user.banner,
        zapService: user.zapService,
        website: user.website,
    }

    const event = { kind: 0, content: JSON.stringify(profile) }

    await publishEvent(event, pairKey)
}

export const pushUserFollows = async (event: NostrEvent, pairKey: PairKey) => {
    
    await publishEvent(event, pairKey, true)
}

type NostrInstanceProps = { user?: User }

export const getNostrInstance = async ({ user }: NostrInstanceProps): Promise<NDK> => {

    const relays = await getRelays()
       
    const ndk = new NDK({ 
        explicitRelayUrls: relays, 
        cacheAdapter: new NDKCacheAdapterSqlite("nevents"),
        clientName: "emptio_p2p",        
    })

    if(user?.keychanges) 
    {
        const pairKey = await getPairKey(user.keychanges ?? "")

        ndk.signer = new NDKPrivateKeySigner(pairKey.privateKey)
    }

    await ndk.connect()

    return ndk
}

type SubscribeProps = { 
    user: User,
    addChat: (chat: ChatUser) => void
}

export const subscribeUser = ({ user, addChat }: SubscribeProps) => {
   
    const ndk = useNDKStore.getState().ndk

    const filters: NDKFilter[] = [
        { kinds: [4], "#p": [user.pubkey ?? ""] },
        { kinds: [4], authors: [user.pubkey ?? ""] }
    ]

    const subscriptionMessages = ndk.subscribe(filters, {
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    })

    subscriptionMessages.on("event", event => {
        if(event.kind == 4) processEventMessage({ user, event, addChat })
    })

    subscriptionMessages.start()
}

