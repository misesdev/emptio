import NDK, { NDKFilter, NDKPrivateKeySigner, 
    NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { EventKinds } from "@src/constants/Events"
import { processDataEvents, processEventMessage, processEventOrders } from "./processEvents"
import { getUserName } from "@src/utils"

export const getUserData = async (publicKey: string): Promise<User> => {

    const event = await getEvent({ 
        authors: [publicKey], 
        kinds: [EventKinds.metadata], 
        limit: 1 
    })

    return event?.content as User
}

export const pushUserData = async (user: User, pairKey: PairKey) => {

    const profile: User = {
        name: user.name,
        display_name: getUserName(user, 100),
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
        bitcoin_address: user.bitcoin_address
    }

    const event = { kind: 0, content: JSON.stringify(profile) }

    await publishEvent(event, pairKey)
}

export const pushUserFollows = async (event: NostrEvent, pairKey: PairKey) => {
    await publishEvent(event, pairKey, true)
}

interface NostrInstanceProps { user?: User }

export const getNostrInstance = async ({ user }: NostrInstanceProps): Promise<NDK> => {

    const relays = await storageService.relays.list()
       
    const ndk = new NDK({ 
        explicitRelayUrls: relays, 
        clientName: "emptio_p2p",  
    })

    if(user?.keychanges) 
    {
        const pairKey = await storageService.secrets.getPairKey(user.keychanges ?? "")

        ndk.signer = new NDKPrivateKeySigner(pairKey.privateKey)
    }

    await ndk.connect()

    return ndk
}

export const searchRelays = async (searchTerm: string, limit: number = 100): Promise<string[]> => {
    try 
    {
        const response = await fetch(`${process.env.NOSBOOK_API_URL}/relays/search`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerm,
                limit
            })
        })

        if(!response.ok) {
            throw new Error("an unexpected error occurred during the request")
        }
        
        const result: any = await response.json()

        return result.sort((a:any, b:any) => (b.similarity ?? 1) - (a.similarity ?? 1))
            .map((data: any) => {
                return data.relay
            })
    }
    catch (ex) {
        console.log(ex)
        return [] 
    }
}

export const subscribeUser = (user: User) => {
  
    const dataEventKinds = [
        EventKinds.metadata,    // user profile data
        EventKinds.followList,  // user pubkey follows list
        10002,                  // user relay list with orders and reputation
        10050,                  // user relay list from chat events
    ]
    const ndk = useNDKStore.getState().ndk

    const filters: NDKFilter[] = [
        { kinds: [4], "#p": [user.pubkey ?? ""] }, // private message to user
        { kinds: [4], authors: [user.pubkey ?? ""] }, // private message from user
        { kinds: dataEventKinds, authors: [user.pubkey ?? ""], limit: dataEventKinds.length }, // sell orders in relays event
        { kinds: [10002], "#o": ["orders"] }, // list orders event with the relay list
    ]

    const subscription = ndk.subscribe(filters, {
        cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
    })

    subscription.on("event", event => {
        if(event.kind == 4) processEventMessage({ user, event })
        if(dataEventKinds.includes(event.kind??0)) 
        {
            if(event.kind == 10002) processEventOrders({ user, event })
            processDataEvents(event)
        }
    })

    subscription.start()
}

