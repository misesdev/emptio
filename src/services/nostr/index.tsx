import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { SecreteKeys, HexPairKeys } from '../memory/types'
import { etc } from "@noble/secp256k1"

export const createPairKeys = (): SecreteKeys => {

    const secreteKey = generateSecretKey()

    const publicKey = nip19.npubEncode(getPublicKey(secreteKey))

    const privateKey = nip19.nsecEncode(secreteKey)

    return { privateKey, publicKey }
}

export const validatePrivateKey = (privateKey: string) => {

    try {
        const { type } = nip19.decode(privateKey)

        return type === "nsec"
    } catch { return false }
}

export const derivatePublicKey = (privateKey: string): string => {

    try {
        const { type, data } = nip19.decode(privateKey)

        if (type === "nsec")
            return nip19.npubEncode(getPublicKey(data))
        else
            return ""
    }
    catch { return "" }
}

export const getHexKeys = (privateKey: string): HexPairKeys => {

    const response: HexPairKeys = { privateKey: "", publicKey: "" }

    try {
        const { type, data } = nip19.decode(privateKey)

        if (type === "nsec") {
            response.publicKey = getPublicKey(data)
            response.privateKey = etc.bytesToHex(data)
        }
    } catch { }

    return response
}
