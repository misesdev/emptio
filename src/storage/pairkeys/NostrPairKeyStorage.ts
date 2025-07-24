import NostrPairKey from "@services/nostr/pairkey/NostrPairKey"
import { PrivateKeyStorage } from "./PrivateKeyStorage"

export class NostrPairKeyStorage 
{
    private readonly _privatekeys: PrivateKeyStorage
    
    constructor(
        storage: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._privatekeys = storage
    }

    public async add(pairkey: NostrPairKey): Promise<void> {
        await this._privatekeys.add(pairkey.getPrivateKey())
    }

    public async get(id: string): Promise<NostrPairKey> {
        let stored = await this._privatekeys.get(id)
        return new NostrPairKey(stored.entity)
    }
    
    public async list(): Promise<NostrPairKey[]> {
        const list = await this._privatekeys.list()
        return list.map(item => new NostrPairKey(item.entity))
    }

    public async remove(id: string): Promise<void> {
        await this._privatekeys.delete(id)
    }
}
