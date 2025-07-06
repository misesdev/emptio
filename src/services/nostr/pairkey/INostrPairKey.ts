import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";

export interface INostrPairKey {
    getPublicKey() : Uint8Array;
    getPublicKeyHex() : string;
    getPrivateKey() : Uint8Array;
    getPrivateKeyHex() : string;
    getNpub() : string;
    getNsec() : string;
    signEvent(event: NDKEvent) : Promise<NDKEvent>
}
