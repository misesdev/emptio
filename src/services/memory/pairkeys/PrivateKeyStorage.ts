import { BaseSecretStorage } from "../base/BaseSecretStorage"
import { PrivateKey } from "../types"

export class PrivateKeyStorage extends BaseSecretStorage<PrivateKey> 
{
    constructor() {
        super("privatekey")
        super.notFoundMessage = "Private key not found"
    }
}

export class NPairKey 
{

}
