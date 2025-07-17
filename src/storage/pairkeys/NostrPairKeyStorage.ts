import NostrPairKey from "../../nostr/pairkey/NostrPairKey"
import { PrivateKeyStorage } from "./PrivateKeyStorage"

export class NostrPairKeyStorage 
{
    private readonly _privatekeys: PrivateKeyStorage
    
    constructor() {
        this._privatekeys = new PrivateKeyStorage()
    }

    public async add(pairkey: NostrPairKey): Promise<void> {
        await this._privatekeys.add(pairkey.getPrivateKey())
    }

    public async get(id: number): Promise<NostrPairKey> {
        let privateKey = await this._privatekeys.get(id)
        return new NostrPairKey(privateKey)
    }
    
    public async list(): Promise<NostrPairKey[]> {
        const list = await this._privatekeys.list()
        return list.map(item => new NostrPairKey(item.entity))
    }

    public async remove(id: number): Promise<void> {
        await this._privatekeys.remove(id)
    }
}
