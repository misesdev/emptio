import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile";
import { User } from "../user/types/User";
import { RelayStorage } from "@storage/relays/RelayStorage";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";

class NostrFactory
{
    private readonly _relayStorage: RelayStorage;
    private readonly _keyStorage: PrivateKeyStorage;
    constructor(
        relayStorage: RelayStorage = new RelayStorage(),
        keyStorage: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._relayStorage = relayStorage
        this._keyStorage = keyStorage
    }

    public async getNostrInstance(user?: User): Promise<NDK>
    {
        await this._relayStorage.init()
        const relays = await this._relayStorage.listEntities()
        const ndk = new NDK({ 
            explicitRelayUrls: relays.map(r => r.url), 
            clientName: "emptio_p2p",  
        })
        if(user?.keyRef) 
        {
            const storedKey = await this._keyStorage.get(user.keyRef)
            ndk.signer = new NDKPrivateKeySigner(storedKey.entity)
        }
        await ndk.connect()
        return ndk
    }
}

export default NostrFactory
