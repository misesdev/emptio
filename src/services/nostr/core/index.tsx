import { getRandomBytes } from 'expo-crypto'
import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"

type SecreteKeys = {
    privateKey?: string,
    publicKey?: string
}

const generateSecreteKey = (bytesLength = 32) => {
    return getRandomBytes(bytesLength)
}

export const createPairKeys = (): SecreteKeys => {

    const secreteKey = generateSecreteKey()

    const publicKey = bytesToHex(schnorr.getPublicKey(secreteKey))

    const privateKey = bytesToHex(secreteKey)

    console.log(`privateKey: ${privateKey}`)

    console.log(`publicKey: ${publicKey}`)

    return { privateKey, publicKey }
}
