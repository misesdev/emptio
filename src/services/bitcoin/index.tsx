import { getRandomBytes } from "expo-crypto"
import { getPublicKey, } from "@noble/secp256k1"
import { bytesToHex } from "@noble/hashes/utils"
import { mnemonicToEntropy, entropyToMnemonic } from "bip39"
import { payments, Psbt, networks } from "bitcoinjs-lib"
import { PairKey } from "../memory/types"
import { getPairKey } from "../memory/pairkeys"
import { signTransaction } from "./signature"
import { getTxsUtxos, sendUtxo } from "./mempool"
import { trackException } from "../telemetry/telemetry"
import { getWallet } from "../memory/wallets"
import { useTranslate } from "../translate"

const network = networks.testnet

export const createWallet = (passPhrase: string = ""): PairKey => {

    const secretBytes = getRandomBytes(32)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { key: "", privateKey, publicKey }
}

export const getBitcoinAddress = (pubkeyHex: string): string => {

    const { address } = payments.p2wpkh({ pubkey: Buffer.from(pubkeyHex, "hex"), network })

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

    const { address } = payments.p2pkh({ pubkey: Buffer.from(publicKey, "hex"), network })

    return address ?? ""
}

type TransactionProps = {
    amount: number,
    destination: string,
    walletKey: string
}

export const sendTransaction = async ({ amount, destination, walletKey }: TransactionProps) => {

    try {
        var utxoAmount = 0

        const transaction = new Psbt()

        const { pairkey, address } = await getWallet(walletKey)

        const { privateKey } = await getPairKey(pairkey ?? "")

        const utxos = await getTxsUtxos(address ?? "")

        if (utxos.reduce((acumulator, iterator) => acumulator + iterator.value, 0) < amount)
            throw new Error(useTranslate("message.transaction.insufficient_funds"))

        for(let index = 0; index <= utxos.length; index++ ) {
            if (utxoAmount < amount) {
                utxoAmount += utxos[index].value
                // define the utxo entered -> buffer
                transaction.addInput({ hash: utxos[index].txid, index })
            } else
                break
        }

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, value: amount })

        // add the change recipient
        if (utxoAmount > amount)
            transaction.addOutput({ address: address ?? "", value: utxoAmount - amount })

        const txTransaction = signTransaction(transaction.toHex(), privateKey)

        // send transaction tx -> hexadecimal sugn transaction
        const txid = await sendUtxo(txTransaction)

        return txid

    } 
    catch (ex) { return trackException(ex) }
}

