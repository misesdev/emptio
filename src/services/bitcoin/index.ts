import { getPublicKey } from "@noble/secp256k1"
import { bytesToHex } from "@noble/hashes/utils"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { PairKey, Wallet } from "../memory/types"
import { getRandomKey } from "./signature"
import { getTxsUtxos, sendUtxo } from "./mempool"
import { Response, trackException } from "../telemetry"
import { Address, BNetwork, ECPairKey, Transaction } from "bitcoin-tx-lib"
import { HDKey } from "@scure/bip32"

export type BaseWallet = {
    pairkey: PairKey,
    mnemonic: string,
    wallet: Wallet
}

export const createWallet = (password: string = "", network: BNetwork = "mainnet"): BaseWallet => {

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

export const importWallet = async (mnemonic: string, password?: string, network: BNetwork = "mainnet"): Promise<BaseWallet> => {
    
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

export const generateAddress = (publicKey: string, net: BNetwork = "mainnet"): string => {

    return Address.fromPubkey({ pubkey:  publicKey, network: net })
}

export const ValidateAddress = (btcAddress: string, net: BNetwork = "mainnet") => {
    try {
        // const network =  net == "testnet" ? networks.testnet : networks.bitcoin
        // address.toOutputScript(btcAddress, network)
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
        var utxoAmount = 0, fee = 0, averageRate = 1

        const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"

        const ecPair = ECPairKey.fromHex({ privateKey: pairkey.privateKey, network })

        const transaction = new Transaction(ecPair)

        const utxos = await getTxsUtxos(wallet.address ?? "", network)

        // ordenate for include all minimal value utxo of wallet
        const ordenedUtxos = utxos.sort((a, b) => a.value - b.value)

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, amount: amount })

        // add the change recipient
        if (utxoAmount > amount) {
            transaction.addOutput({ 
                address: wallet.address ?? "",
                amount: utxoAmount - amount 
            })
        }

        for (let utxo of ordenedUtxos) {
            if (utxoAmount <= amount+fee) {
                utxoAmount += utxo.value
                let scriptPubKey = Address.getScriptPubkey(wallet.address??"")
                transaction.addInput({
                    vout: utxo.vout,
                    txid: utxo.txid,
                    value: utxo.value,
                    scriptPubKey
                })

                fee += averageRate * transaction.vBytes()
            } 
            else
                break
        }

        const txHex = transaction.build()

        return { success: true, message: "", data: txHex }
    }
    catch (ex) {
        return trackException(ex)
    }
}

export const sendTransaction = async (transactionHex: string, network: BNetwork): Promise<Response<any>> => {

    try {
        const txid = await sendUtxo(transactionHex, network)

        return { success: true, message: "", data: txid }
    }
    catch (ex) { return trackException(ex) }
}


