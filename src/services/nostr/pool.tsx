import NDK, { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk"
import { PairKey, User } from "../memory/types"
import { listenerEvents, publishEvent, NostrEvent } from "./events"
import { getRelays } from "../memory/relays"
import { getPairKey } from "../memory/pairkeys"
import { NotificationApp } from "../notification/application"
import { AppState } from "react-native"
import { pushNotification } from "../notification"
import { insertEvent } from "../memory/database/events"

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
    homeState: boolean,
    feedState: boolean,
    ordersState: boolean,
    messageState: boolean,
    setNotificationApp?: (notification: NotificationApp) => void
}

export const subscribeUser = ({ user, messageState, setNotificationApp }: SubscribeProps) => {
    const pool = Nostr as NDK

    const subscriptionMessages = pool.subscribe([
        { kinds: [4], "#p": [user.pubkey ?? ""] }, 
        { kinds: [4], authors: [user.pubkey ?? ""] }
    ])

    const processEventMessage = async (event: NDKEvent) => { 
        if(await insertEvent({ event, category: "message" })) 
        {
            if(setNotificationApp && !messageState) 
                setNotificationApp({ state: true, type: "message" })

            if(["inactive", "background", "unknown", "extension"].includes(AppState.currentState))
            {
                await event.decrypt() 
                const profile = await event.author.fetchProfile()
                console.log(event.author)
                await pushNotification({ 
                    title: profile?.displayName ?? profile?.name ?? "",
                    message: event.content.length <= 30 ? event.content : `${event.content.substring(0,30)}..`
                })
            }
        }
    }
    
    subscriptionMessages.on("event", async (event: NDKEvent) => {
        try 
        {
            if([4].includes(event.kind ?? 0)) 
            {
                await processEventMessage(event) 
            }
        } 
        catch (ex) { console.log(ex) }
    })

    subscriptionMessages.start()
}
