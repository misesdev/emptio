import { getRandomBytes } from 'expo-crypto'
import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex } from "@noble/hashes/utils"

const prefix = { private: "nsec", public: "npub" }

type SecreteKeys = {
    privateKey: string,
    publicKey?: string
}

const generateSecreteKey = (bytesLength = 32) => {
    return getRandomBytes(bytesLength)
}

export const createPairKeys = (): SecreteKeys => {

    const secreteKey = generateSecreteKey()

    const publicKey = prefix.public + bytesToHex(schnorr.getPublicKey(secreteKey))

    const privateKey = prefix.private + bytesToHex(secreteKey)

    return { privateKey, publicKey }
}

export const getPublicKey = (privateKey: string) => {
   
    const clearNsec = privateKey.replace(prefix.private, "")

    return prefix.public + bytesToHex(schnorr.getPublicKey(clearNsec))
}
