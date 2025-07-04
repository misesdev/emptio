import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";

export interface INostrPairKey {
    getPublicKey() : string;
    getPrivateKey() : string;
    getNpub() : string;
    getNsec() : string;
    signEvent(event: NDKEvent) : Promise<NDKEvent>
}
