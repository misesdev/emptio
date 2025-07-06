import { nip19 } from "nostr-tools"
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex } from "bitcoin-tx-lib";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile";
import { INostrPairKey } from "./INostrPairKey";

class NostrPairKey implements INostrPairKey
{
    private readonly _privateKey: Uint8Array

    constructor(privateKey: Uint8Array) {
        this._privateKey = privateKey 
    }

    public static create() : NostrPairKey {
        const privateKey = secp256k1.utils.randomPrivateKey()
        return new NostrPairKey(privateKey) 
    }

    public static fromNsec(nsec: string) : NostrPairKey {
        const { type, data } = nip19.decode(nsec)
        if(type != "nsec")
            throw new Error("Expected a private key in nsec format")
        return new NostrPairKey(data)
    }

    public static validateNsec(nsec: string) : boolean {
        try {
            const { type } = nip19.decode(nsec)
            return type === "nsec"
        } catch { return false }
    }

    public getPublicKey() : Uint8Array {
        const publickKey = secp256k1.getPublicKey(this._privateKey)
        return publickKey.slice(1)
    }

    public getPublicKeyHex() : string {
        const publickKey = secp256k1.getPublicKey(this._privateKey)
        return bytesToHex(publickKey.slice(1))
    }
    
    public getPrivateKey() : Uint8Array {
        return this._privateKey
    }
    
    public getPrivateKeyHex() : string {
        return bytesToHex(this._privateKey)
    }
    
    public getNpub() : string {
        const pubkey = this.getPublicKeyHex()
        return nip19.npubEncode(pubkey)
    }

    public getNsec() : string {
        return nip19.nsecEncode(this._privateKey)
    }

    public async signEvent(event: NDKEvent) : Promise<NDKEvent> {
        const signer = new NDKPrivateKeySigner(this._privateKey)
        await event.sign(signer)
        return event
    }
}

export default NostrPairKey
