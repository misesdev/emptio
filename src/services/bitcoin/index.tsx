import { getRandomBytes } from "expo-crypto"
import { getPublicKey } from "@noble/secp256k1"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
import { mnemonicToEntropy, entropyToMnemonic, mnemonicToSeedSync } from "bip39"
import { payments } from "bitcoinjs-lib"
import { HexPairKeys } from "../memory/types"

// export const passPhraseToSeed = (passPhrase: string): string => {

//     const seed = mnemonicToSeedSync(passPhrase)

//     console.log(seed)

//     return seed
// }

export const createWallet = (passPhrase: string = "") : HexPairKeys => {

    const secretBytes = getRandomBytes(32)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { privateKey, publicKey }
}

export type SeedProps = {
    seed: string, // phrase with 12 or 24 words
    passPhrase: string // password with a 
}

export const seedToWallet = (seedPhrase: string) : HexPairKeys => {

    const privateKey = mnemonicToEntropy(seedPhrase)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { privateKey, publicKey }
}

export const getSeedPhrase = (privateKey: string): string => entropyToMnemonic(privateKey)

export const generateAddress = (publicKey: string): string  => {

    const publicbytes = hexToBytes(publicKey)

    const { address } = payments.p2pkh({ pubkey: Buffer.from(publicbytes) })

    return address ? address : ""
}


