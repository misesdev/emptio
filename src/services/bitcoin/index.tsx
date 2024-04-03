import { getRandomBytes } from "expo-crypto"
import { getPublicKey, } from "@noble/secp256k1"
import { bytesToHex } from "@noble/hashes/utils"
import { mnemonicToEntropy, entropyToMnemonic, mnemonicToSeed } from "bip39"
import { payments, Psbt, networks, address, Transaction } from "bitcoinjs-lib"
import { PairKey } from "../memory/types"
import { getPairKey } from "../memory/pairkeys"
import { getRandomKey, signHex } from "./signature"
import { getTxsUtxos, sendUtxo } from "./mempool"
import { trackException } from "../telemetry/telemetry"
import { getWallet } from "../memory/wallets"
import { useTranslate } from "../translate"
import env from "@/env"

const network = env.mempool.network == "testnet" ? networks.testnet : networks.bitcoin

export const createWallet = (): PairKey => {

    const key = getRandomKey(10)

    const secretBytes = getRandomBytes(32)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { key, privateKey, publicKey }
}

export const importWallet = async (seedPhrase: string, password?: string): Promise<PairKey> => {

    const key = getRandomKey(10)

    const secretBytes = await mnemonicToSeed(seedPhrase, password)

    const privateKey = bytesToHex(secretBytes)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { key, privateKey, publicKey }
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

    const { address } = payments.p2wpkh({ pubkey: Buffer.from(publicKey, "hex"), network })

    return address ?? ""
}

type TransactionProps = {
    amount: number,
    destination: string,
    walletKey: string
}

export const ValidateAddress = (btcAddress: string) => {
    try {
        address.toOutputScript(btcAddress, network)
        return true
    } catch { return false }
}

export const sendTransaction = async ({ amount, destination, walletKey }: TransactionProps) => {

    try {
        var utxoAmount = 0

        const transaction = new Psbt({ network })

        const { pairkey, address } = await getWallet(walletKey)

        const { privateKey, publicKey } = await getPairKey(pairkey ?? "")

        const utxos = await getTxsUtxos(address ?? "")

        if (utxos.reduce((acumulator, iterator) => acumulator + iterator.value, 0) < amount)
            throw new Error(useTranslate("message.transaction.insufficient_funds"))

        const ordenedUtxos = utxos.sort((a, b) => a.value - b.value)

        for (let index = 0; index <= ordenedUtxos.length; index++) {
            if (utxoAmount < amount) {
                utxoAmount += utxos[index].value
                // define the utxo entered -> buffer
                transaction.addInput({ hash: utxos[index].txid, index, nonWitnessUtxo: Buffer.from(utxos[index].txid, "hex") })
            } else
                break
        }

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, value: amount })

        // add the change recipient
        if (utxoAmount > amount)
            transaction.addOutput({ address: address ?? "", value: utxoAmount - amount })

        transaction.signAllInputs({
            publicKey: Buffer.from(publicKey, "hex"),
            sign: (hash: Buffer, lowR?: boolean): Buffer => {

                var signed = signHex(hash.toString("hex"), privateKey)

                return Buffer.from(signed, "hex")
            }
        })

        transaction.finalizeAllInputs()

        var txHex = transaction.extractTransaction().toHex()

        return await sendUtxo(txHex)
    }
    catch (ex) { return trackException(ex) }
}

