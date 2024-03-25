import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools"
import { SecreteKeys } from '../memory/types'

export const createPairKeys = (): SecreteKeys => {

    const secreteKey = generateSecretKey()

    const publicKey = nip19.npubEncode(getPublicKey(secreteKey))

    const privateKey = nip19.nsecEncode(secreteKey)

    return { privateKey, publicKey }
}

export const nsecEncode = (privateKey?: string) => {

    const key = generateSecretKey()

    const nsec = nip19.nsecEncode(key)

    console.log(nsec)
}
