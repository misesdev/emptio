import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { bytesToHex } from "@noble/hashes/utils"
import { PairKey } from '../memory/types'
import { getRandomKey } from "../bitcoin/signature"

export const createPairKeys = (): PairKey => {

    const key = getRandomKey(10) 

    const secreteKey = generateSecretKey()

    const publicKey = getPublicKey(secreteKey)

    const privateKey = bytesToHex(secreteKey)

    return { key, privateKey, publicKey }
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

export const getHexKeys = (privateKey: string): PairKey => {

    const key = (Math.random() * 9999).toFixed(0).toString()

    const response: PairKey = { key, privateKey: "", publicKey: "" }

    const { type, data } = nip19.decode(privateKey)

    if (type === "nsec") {
        response.publicKey = getPublicKey(data)
        response.privateKey = bytesToHex(data)
    }

    return response
}
