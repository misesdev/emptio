import { BaseSecretStorage } from "../base/BaseSecretStorage"

export class PrivateKeyStorage extends BaseSecretStorage<Uint8Array> 
{
    constructor() {
        super("privatekey")
        super.notFoundMessage = "Private key not found"
    }

    public async listEntities() : Promise<Uint8Array[]> {
        const list = await this.list()
        return list.map(item => item.entity)
    }
}

