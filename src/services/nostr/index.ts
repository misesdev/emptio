import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { PairKey } from '../memory/types'
import { getRandomKey } from "../bitcoin/signature"
import { bytesToHex } from "bitcoin-tx-lib"

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

export const derivatePublicKey = (nsec: string): string => {
    const { type, data } = nip19.decode(nsec)
    if (type === "nsec") return getPublicKey(data)
    
    throw new Error("Expected nsec format")
}

export const getHexKeys = (nsec: string): PairKey => {

    const key = getRandomKey(15) 

    const response: PairKey = { key, privateKey: "", publicKey: "" }

    const { type, data } = nip19.decode(nsec)

    if (type === "nsec") {
        response.publicKey = getPublicKey(data)
        response.privateKey = bytesToHex(data)
    }

    return response
}
