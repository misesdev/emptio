import NDK, { NDKCacheAdapterSqlite, NDKEvent, NDKPrivateKeySigner, NDKRelay, NDKUser } from "@nostr-dev-kit/ndk-mobile"
import { PairKey, User } from "../memory/types"
import { publishEvent, NostrEvent, getPubkeyFromTags, getEvent } from "./events"
import { getRelays } from "../memory/relays"
import { getPairKey } from "../memory/pairkeys"
import { AppState } from "react-native"
import { insertEvent } from "../memory/database/events"
import { messageService } from "@/src/core/messageManager"
import { ChatUser } from "../zustand/chats"
import useNDKStore from "../zustand/ndk"
import { NostrEventKinds } from "@/src/constants/Events"

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
    const promises: Promise<void>[] = []

    const subscriptionMessages = ndk.subscribe([
        { kinds: [4], "#p": [user.pubkey ?? ""] },
        { kinds: [4], authors: [user.pubkey ?? ""] }
    ])

    subscriptionMessages.on("event", event => {
        if(event.kind == 4)
            promises.push(processEventMessage({ user, event, addChat }))
    })

    subscriptionMessages.start()
    
    setTimeout(async () => {
        await Promise.all(promises)
    }, 500)
}

type addChatProps = { 
    user: User,
    event: NDKEvent,
    addChat: (chat: ChatUser) => void
}

const processEventMessage = async ({ user, event, addChat }: addChatProps) => { 
    try {
        const chat_id = messageService.generateChatId(event)

        if(await insertEvent({ event, category: "message", chat_id })) 
        {
            if(event.pubkey == user.pubkey)
                event.pubkey = getPubkeyFromTags(event)

            addChat({ chat_id, lastMessage: event })

            // if(["inactive", "background"].includes(AppState.currentState))
            // {
            //     await event.decrypt() 
            //     const profile = await event.author.fetchProfile()
            //     await pushNotification({ 
            //         title: profile?.displayName ?? profile?.name ?? "",
            //         message: event.content.length <= 30 ? event.content : `${event.content.substring(0,30)}..`
            //     })
            // }
        }
    } catch { }
}
