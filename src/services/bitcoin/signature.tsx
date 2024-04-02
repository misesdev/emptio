import { sign, etc } from "@noble/secp256k1"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha256"
// pollyfil  resolve utils sha256 secp256k1
etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, etc.concatBytes(...m))
// etc.hmacSha256Async = (k, ...m) => Promise.resolve(etc.hmacSha256Sync(k, ...m))

export const signature = (txContent: string, privKeyHex: string) : string => {

    const signatureHex = sign(txContent, privKeyHex)

    return signatureHex.toCompactHex()
}

export const signTransaction = (txHex: string, privKeyHex: string) : string => {

    const signature = sign(txHex, privKeyHex)

    const transaction = txHex + signature.toCompactHex()

    return transaction
}
