import NDK, { NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile";
import useNDKStore from "../zustand/useNDKStore";
import { User } from "../user/types/User";
import { NostrEventHandler } from "./NostrEventHandler";

export class SubscriptionService
{
    private readonly _ndk: NDK;
    private readonly _handler: NostrEventHandler;
    constructor(
        ndk: NDK = useNDKStore.getState().ndk,
        handler: NostrEventHandler = new NostrEventHandler()
    ) {
        this._ndk = ndk
        this._handler = handler
    }

    public async subscribeUser(user: User)
    {
        const kinds = this._handler.kindsDataEvents
        const filters: NDKFilter[] = [
            { kinds: [4], "#p": [user.pubkey ?? ""] }, // private message to user
            { kinds: [4], authors: [user.pubkey ?? ""] }, // private message from user
            { kinds, authors: [user.pubkey ?? ""], limit: kinds.length }, // sell orders in relays event
            { kinds: [10002], "#o": ["orders"] }, // list orders event with the relay list
        ]
        const subscription = this._ndk.subscribe(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })
        subscription.on("event", event => {
            this._handler.handleEvent({ user, event })
        })
        subscription.start()
    }
}
