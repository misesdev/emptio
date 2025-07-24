import { BNetwork, ECPairKey } from "bitcoin-tx-lib";
import { PrivateKeyStorage } from "./PrivateKeyStorage";

export class ECPairKeyStorage 
{
    private readonly _privatekeys: PrivateKeyStorage
    constructor(
        storage: PrivateKeyStorage = new PrivateKeyStorage()
    ) {
        this._privatekeys = storage
    }

    public async add(pairkey: ECPairKey): Promise<void> {
        await this._privatekeys.add(pairkey.getPrivateKey())
    }

    public async get(id: string, network: BNetwork="mainnet"): Promise<ECPairKey> {
        let stored = await this._privatekeys.get(id)
        return new ECPairKey({
            privateKey: stored.entity, 
            network 
        })
    }
    
    public async list(network: BNetwork="mainnet"): Promise<ECPairKey[]> {
        const list = await this._privatekeys.list()
        return list.map(item => {
            return new ECPairKey({
                privateKey: item.entity,
                network
            })
        })
    }

    public async remove(id: string): Promise<void> {
        await this._privatekeys.delete(id)
    }
}
