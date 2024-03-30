import { getRandomBytes } from "expo-crypto"
import { getPublicKey } from "@noble/secp256k1"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
// const bitcore = require("bitcoinjs-lib")
import { payments } from "bitcoinjs-lib"

import { mnemonicToEntropy, entropyToMnemonic } from "bip39"
import { HexPairKeys } from "../memory/types"

export const createWallet = () : HexPairKeys => {

    const secretBytes = getRandomBytes(32)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { privateKey, publicKey }
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


