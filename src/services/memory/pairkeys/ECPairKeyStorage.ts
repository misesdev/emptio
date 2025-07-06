import { BNetwork, ECPairKey } from "bitcoin-tx-lib";
import { PrivateKeyStorage } from "./PrivateKeyStorage";

export class ECPairKeyStorage 
{
    private readonly _privatekeys: PrivateKeyStorage
    constructor() {
        this._privatekeys = new PrivateKeyStorage()
    }

    public async add(pairkey: ECPairKey): Promise<void> {
        await this._privatekeys.add(pairkey.getPrivateKey())
    }

    public async get(id: number, network: BNetwork="mainnet"): Promise<ECPairKey> {
        let privateKey = await this._privatekeys.get(id)
        return new ECPairKey({ privateKey, network })
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

    public async remove(id: number): Promise<void> {
        await this._privatekeys.remove(id)
    }
}
