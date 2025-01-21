import NDK, { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk"
import { PairKey, User } from "../memory/types"
import { listenerEvents, publishEvent } from "./events"
import { getRelays } from "../memory/relays"

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

type SubscribeProps = {
    user: User
}

export const getNostrInstance = async (): Promise<NDK> => {

    const relays = await getRelays()

    const ndk = new NDK({ explicitRelayUrls: relays })

    await ndk.connect()

    return ndk
}

export const subscribeUser = ({ user }: SubscribeProps) => {
    
    const pool = Nostr as NDK

    const subscription = pool.subscribe({ kinds: [1,4], "#p": [user.pubkey ?? ""] })

    subscription.on("event", (event: NDKEvent) => {
        
    })
}
