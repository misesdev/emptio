import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { SecreteKeys, HexPairKeys } from '../memory/types'
import { bytesToHex } from "@noble/hashes/utils"

export const createPairKeys = (): SecreteKeys => {

    const secreteKey = generateSecretKey()

    const publicKey = getPublicKey(secreteKey)

    const privateKey = bytesToHex(secreteKey)

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
            return getPublicKey(data)
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
            response.privateKey = bytesToHex(data)
        }
    } catch { }

    return response
}
