import { BaseSecretStorage } from "../base/BaseSecretStorage"

export class PrivateKeyStorage extends BaseSecretStorage 
{
    constructor() {
        super("privatekey")
        super.notFoundMessage = "Private key not found"
    }
}

