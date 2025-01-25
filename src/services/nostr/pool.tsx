import NDK, { NDKEvent, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk"
import { PairKey, User } from "../memory/types"
import { listenerEvents, publishEvent, NostrEvent, getPubkeyFromTags } from "./events"
import { getRelays } from "../memory/relays"
import { getPairKey } from "../memory/pairkeys"
import { AppState } from "react-native"
import { insertEvent } from "../memory/database/events"
import { messageService } from "@/src/core/messageManager"
import { ChatUser } from "../zustand/chats"
import { nip04, nip44 } from "nostr-tools"
import { hexToBytes } from "@noble/curves/abstract/utils"

export const getUserData = async (publicKey: string): Promise<User> => {

    const event = (await listenerEvents({ authors: [publicKey], kinds: [0] }))[0]

    return event.content
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

type NostrInstanceProps = { user: User }

export const getNostrInstance = async ({ user }: NostrInstanceProps): Promise<NDK> => {

    const relays = await getRelays()

    const pairKey = await getPairKey(user.keychanges ?? "")

    const ndk = new NDK({ explicitRelayUrls: relays })

    ndk.signer = new NDKPrivateKeySigner(pairKey.privateKey)
    
    await ndk.connect()

    return ndk
}

type SubscribeProps = { 
    user: User,
    addChat: (chat: ChatUser) => void
}

export const subscribeUserChat = ({ user, addChat }: SubscribeProps) => {
    const pool = Nostr as NDK

    const subscriptionMessages = pool.subscribe([
        { kinds: [4], "#p": [user.pubkey ?? ""] }, { kinds: [4], authors: [user.pubkey ?? ""] }
    ])

    const processEventMessage = async (event: NDKEvent) => { 
        
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
    }
    
    subscriptionMessages.on("event", (event) => { 
        if(event.kind == 4) processEventMessage(event)
    })

    subscriptionMessages.start()
}
