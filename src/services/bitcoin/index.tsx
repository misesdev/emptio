import { getPublicKey } from "@noble/secp256k1"
import { bytesToHex } from "@noble/hashes/utils"
import { mnemonicToEntropy, entropyToMnemonic, generateMnemonic, mnemonicToSeedSync } from "bip39"
import { payments, Psbt, networks, address } from "bitcoinjs-lib"
import { PairKey, Wallet } from "../memory/types"
import { getRandomKey, signBuffer, verifySign } from "./signature"
import { getTxsUtxos, getUtxo, sendUtxo } from "./mempool"
import { Response, trackException } from "../telemetry"
import { Network } from "./types"
import { HDKey } from "@scure/bip32"

export type BaseWallet = {
    pairkey: PairKey,
    mnemonic: string,
    wallet: Wallet
}

export const createWallet = (password: string = "", network: Network = "mainnet"): BaseWallet => {

    const key = getRandomKey(10)

    const mnemonic = generateMnemonic(128)

    const seed = mnemonicToSeedSync(mnemonic, password)

    const root = HDKey.fromMasterSeed(seed)

    const privateKey = bytesToHex(root.privateKey as Uint8Array)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    const pairkey =  { key, privateKey, publicKey }

    return { pairkey, mnemonic, wallet: {} }
}

export const importWallet = async (mnemonic: string, password?: string, network: Network = "mainnet"): Promise<BaseWallet> => {
    
    const key = getRandomKey(10)

    const seed = mnemonicToSeedSync(mnemonic, password)

    const root = HDKey.fromMasterSeed(seed)

    const privateKey = bytesToHex(root.privateKey as Uint8Array)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    const pairkey =  { key, privateKey, publicKey }

    return { pairkey, mnemonic, wallet: {} }
}


export type SeedProps = {
    seed: string, // phrase with 12 or 24 words
    passPhrase: string // password with a 
}

export const seedToWallet = (seedPhrase: string): PairKey => {

    const key = getRandomKey(10)

    const privateKey = mnemonicToEntropy(seedPhrase)

    const publicbytes = getPublicKey(privateKey)

    const publicKey = bytesToHex(publicbytes)

    return { key, privateKey, publicKey }
}

export const generateAddress = (publicKey: string, net: Network = "mainnet"): string => {

    const network =  net == "testnet" ? networks.testnet : networks.bitcoin

    const { address } = payments.p2wpkh({ pubkey: Buffer.from(publicKey, "hex"), network })

    return address ?? ""
}

export const ValidateAddress = (btcAddress: string, net: Network = "mainnet") => {
    try {
        const network =  net == "testnet" ? networks.testnet : networks.bitcoin
        address.toOutputScript(btcAddress, network)
        return true
    } catch { return false }
}

type TransactionProps = {
    amount: number,
    destination: string,
    wallet: Wallet,
    pairkey: PairKey
}

export const createTransaction = async ({ amount, destination, wallet, pairkey }: TransactionProps): Promise<Response<any>> => {
    try 
    {
        var utxoAmount = 0

        const net: Network = wallet.type == "bitcoin" ? "mainnet" : "testnet"

        const network = wallet.type == "bitcoin" ? networks.bitcoin : networks.testnet

        const transaction = new Psbt({ network })

        const utxos = await getTxsUtxos(wallet.address ?? "", net)

        // ordenate for include all minimal value utxo of wallet
        const ordenedUtxos = utxos.sort((a, b) => a.value - b.value)

        for (var utxo of ordenedUtxos) {
            if (utxoAmount < amount) {
                utxoAmount += utxo.value
                var index = ordenedUtxos.indexOf(utxo)
                var completeUtxo = await getUtxo(utxo.txid, net)
                var scripPubkeys = completeUtxo.vout.filter(x => x.scriptpubkey_address == wallet.address).map(tx => tx.scriptpubkey)
                // define the utxo entered -> buffer
                transaction.addInput({
                    index,
                    hash: utxo.txid,
                    witnessUtxo: {
                        script: Buffer.from(scripPubkeys[0], "hex"),
                        value: utxo.value
                    }
                })
            } 
            else
                break
        }

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, value: amount })

        // add the change recipient
        if (utxoAmount > amount)
            transaction.addOutput({ address: wallet.address ?? "", value: utxoAmount - amount })

        transaction.signAllInputs({
            network,
            publicKey: Buffer.from(pairkey.publicKey, 'hex'),
            sign: (hash: Buffer, lowR?: boolean): Buffer => signBuffer(hash, pairkey.privateKey, lowR),
            getPublicKey: () => Buffer.from(pairkey.publicKey, 'hex')
        })
        
        transaction.validateSignaturesOfAllInputs(verifySign)
        
        transaction.finalizeAllInputs()

        const txHex = transaction.extractTransaction().toHex()

        return { success: true, message: "", data: txHex }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const sendTransaction = async (transactionHex: string, network: Network): Promise<Response<any>> => {

    try {
        const txid = await sendUtxo(transactionHex, network)

        return { success: true, message: "", data: txid }
    }
    catch (ex) { return trackException(ex) }
}


