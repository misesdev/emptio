import { secp256k1 } from "@noble/curves/secp256k1"
import { Network, Signer } from "bitcoinjs-lib"
import { PairKey } from "../memory/types"
import { timeSeconds } from "../converter"

export const signHex = (txHex: string, privKeyHex: string): string => {

    const signature = secp256k1.sign(txHex, privKeyHex)

    return signature.toDERHex() //transaction
}

export const signBuffer = (txHash: Buffer, privKeyHex: string, lowR?: boolean): Buffer => {

    const signature = secp256k1.sign(txHash, privKeyHex, { lowS: lowR }).toDERHex()

    return Buffer.from(signature, "hex")
}

export const verifySign = (pubkey: Buffer, msghash: Buffer, signature: Buffer) => secp256k1.verify(signature.toString('hex'), pubkey.toString('hex'), msghash.toString('hex'))

export const signOutPut = (signHash: Buffer, privateKey: string) => {

    const signature = secp256k1.sign(signHash, privateKey)

    return Buffer.from(signature.toCompactHex(), "hex")
}

interface SignerProps { network: Network, pairkey: PairKey }

export const getSigner = ({ network, pairkey }: SignerProps): Signer => {
    return {
        network,
        publicKey: Buffer.from(pairkey.publicKey, 'hex'),
        sign: (hash: Buffer, lowR?: boolean): Buffer => signBuffer(hash, pairkey.privateKey, lowR),
        getPublicKey: () => Buffer.from(pairkey.publicKey, 'hex')
    }
}

export const getRandomKey = (length: number): string => {

    var hash = ""
    const timestamp = timeSeconds.now().toFixed(0)
    const characters = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM"

    hash += timestamp.substring(timestamp.length/2)

    while (hash.length < length) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        hash += characters[randomIndex]
    }

    return hash.slice(0, length)
}



