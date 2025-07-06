import EncryptedStorage from "react-native-encrypted-storage"
import { PairKey, PrivateKey } from "../types"
import { ECPairKey } from "bitcoin-tx-lib"
import { BaseSecretStorage } from "../base/BaseSecretStorage"

export class PrivateKeyStorage extends BaseSecretStorage<PrivateKey> {
    constructor() {
        super("privatekey")
        super.notFoundMessage = "Private key not found"
    }
}

export class SecretStorage {

    static async getSecret(key: string) : Promise<Secret> {
        let secrets = await this.listScrets()
        let secret = secrets.find(s => s.key === key)
        if(!secret) 
            throw new Error("secret not found")
        return secret
    }

    static async addSecret(secret: Secret) : Promise<void> {
        let secrets = await this.listScrets()
        secrets.push(secret)
        await this.saveSecrets(secrets)
    }

    static async deleteSecret(key: string) : Promise<void> {
        let secrets = await this.listScrets()
        await this.saveSecrets(secrets.filter(s => s.key != key))
    }

    static async getPairKey(key: string, marker: boolean = true) : Promise<PairKey> {
        let secret = await this.getSecret(key)
        let ecPair = ECPairKey.fromHex({ privateKey: secret.value })
        let pubkey = ecPair.getPublicKeyCompressed("hex")
        return {
            key,
            privateKey: ecPair.privateKey,
            publicKey: marker ? pubkey : pubkey.slice(2)
        }
    }

    static async addPairKey(pair: PairKey) : Promise<void> {
        await this.addSecret({
            key: pair.key,
            value: pair.privateKey
        })
    }

    static async deletePairKey(key: string) : Promise<void> {
        let secrets = await this.listScrets()
        await this.saveSecrets(secrets.filter(s => s.key != key))
    }

    private static async listScrets() : Promise<Secret[]> {
        let secrets: Secret[] = []
        let data = await EncryptedStorage.getItem("secrets")
        if(data) secrets = JSON.parse(data) as Secret[]
        return secrets
    }

    private static async saveSecrets(secrets: Secret[]) : Promise<void> {
        await EncryptedStorage.setItem("secrets", JSON.stringify(secrets))
    }
}

