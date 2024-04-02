import { getRandomBytes } from "expo-crypto"
import { getPublicKey, } from "@noble/secp256k1"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
import { mnemonicToEntropy, entropyToMnemonic } from "bip39"
import { payments, Psbt } from "bitcoinjs-lib"
import { PairKey } from "../memory/types"
import { getUser } from "../memory/user"
import { getPairKey } from "../memory/pairkeys"
import { signTransaction } from "./signature"
import { sendUtxo } from "./mempool"
import { trackException } from "../telemetry/telemetry"


export const createWallet = (passPhrase: string = ""): PairKey => {

    const secretBytes = getRandomBytes(32)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    console.log("public address: ", getBitcoinAddress(publicKey))

    return { key: "", privateKey, publicKey }
}

export const getBitcoinAddress = (pubHex: string) : string => {

    const { address } = payments.p2wpkh({ pubkey: Buffer.from(pubHex, "hex") })

    return address ?? ""
}

export type SeedProps = {
    seed: string, // phrase with 12 or 24 words
    passPhrase: string // password with a 
}

export const seedToWallet = (seedPhrase: string): PairKey => {

    const privateKey = mnemonicToEntropy(seedPhrase)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { key: "", privateKey, publicKey }
}

export const getSeedPhrase = (privateKey: string): string => entropyToMnemonic(privateKey)

export const generateAddress = (publicKey: string): string => {

    const { address } = payments.p2pkh({ pubkey: Buffer.from(publicKey, "hex") })

    return address ?? ""
}

type TransactionProps = {
    amount: number,
    destination: string
}

export const bitcoinSend = async ({ amount, destination }: TransactionProps) => {

    try {
        const transaction = new Psbt()

        const { keychanges } = await getUser()

        const { privateKey, publicKey } = await getPairKey(keychanges ?? "")



        Buffer.from(privateKey, "hex")

        // define the utxo entered -> buffer
        transaction.addInput({ hash: "a7b4e7361fbfb2e2a12b4b681cb8f5fc8d7cf0c7b2d1dd8ac95f76d6b8e98265", index: 0 })

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, value: amount })

        transaction.addOutputs([
            // payment output
            { address: destination, value: amount },
            // payment change output
            { address: destination, value: amount }
        ])

        const txHex = transaction.toHex()

        const txtransaction = signTransaction(txHex, privateKey)

        // send transaction tx -> hexadecimal sugn transaction
        const txid = await sendUtxo(txtransaction)
    } catch (ex) {
        return trackException(ex)
    }
}

