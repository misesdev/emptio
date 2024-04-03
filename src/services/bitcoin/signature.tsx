import { sign, etc } from "@noble/secp256k1"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha256"
// pollyfil  resolve utils sha256 secp256k1
etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, etc.concatBytes(...m))
// etc.hmacSha256Async = (k, ...m) => Promise.resolve(etc.hmacSha256Sync(k, ...m))

export const signHex = (txHex: string, privKeyHex: string): string => {

    const shaHash = sha256.create().update(txHex).digest()

    const signature = sign(shaHash, privKeyHex)

    return signature.toCompactHex() //transaction
}

export const signOutPut = (signHash: Buffer, privateKey: string) => {

    const signature = sign(signHash, privateKey)

    return Buffer.from(signature.toCompactHex(), "hex")
}

export const getRandomKey = (length: number): string => {

    var hash = ""
    const characters = []
    // Adicionando letras maiúsculas
    for (let i = 65; i <= 90; i++) 
        characters.push(String.fromCharCode(i))

    // Adicionando letras minúsculas
    for (let i = 97; i <= 122; i++) 
        characters.push(String.fromCharCode(i))

    // Adicionando números
    for (let i = 0; i <= 9; i++) 
        characters.push(i.toString())

    for (let i = 0; i <= length; i++) 
        hash += characters[parseInt((Math.random() * characters.length).toFixed(0))]

    return hash
}