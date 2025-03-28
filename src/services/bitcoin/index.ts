import { bytesToHex } from "@noble/hashes/utils"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { PairKey, Wallet } from "../memory/types"
import { getRandomKey } from "./signature"
import { getTxsUtxos, sendTx } from "./mempool"
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

    const ecPairkey = ECPairKey.fromHex({ privateKey, network })

    const pairkey =  { key, privateKey, publicKey: ecPairkey.getPublicKeyCompressed("hex") }

    return { pairkey, mnemonic, wallet: {} }
}

export const importWallet = async (mnemonic: string, password?: string, network: BNetwork = "mainnet"): Promise<BaseWallet> => {
    
    const key = getRandomKey(10)

    const seed = mnemonicToSeedSync(mnemonic, password)

    const root = HDKey.fromMasterSeed(seed)

    const privateKey = bytesToHex(root.privateKey as Uint8Array)

    const ecPairkey = ECPairKey.fromHex({ privateKey, network })

    const pairkey =  { key, privateKey, publicKey: ecPairkey.getPublicKeyCompressed("hex") }

    return { pairkey, mnemonic, wallet: {} }
}


export type SeedProps = {
    seed: string, // phrase with 12 or 24 words
    passPhrase: string // password with a 
}

export const generateAddress = (publicKey: string, net: BNetwork = "mainnet"): string => {
    return Address.fromPubkey({ pubkey:  publicKey, network: net })
}

export const ValidateAddress = (btcAddress: string) => Address.isValid(btcAddress) 

type TransactionProps = {
    amount: number,
    destination: string,
    recomendedFee: number,
    wallet: Wallet,
    pairkey: PairKey
}

export const createTransaction = async ({ amount, destination, recomendedFee,
    wallet, pairkey }: TransactionProps): Promise<Response<any>> => {
    try 
    {
        var utxoAmount = 0 // bytes of output has change 

        const network: BNetwork = wallet.type == "bitcoin" ? "mainnet" : "testnet"

        const ecPair = ECPairKey.fromHex({ privateKey: pairkey.privateKey, network })

        const transaction = new Transaction(ecPair)

        const utxos = await getTxsUtxos(wallet.address ?? "", network)

        // ordenate for include all minimal value utxo of wallet
        const ordenedUtxos = utxos.sort((a, b) => a.value - b.value)

        // add destination address transaction -> buffer
        transaction.addOutput({ address: destination, amount: amount })
        // add the change recipient, the amount is defined later
        transaction.addOutput({ address: wallet.address ?? "", amount: 10 })

        let calculatedFee = 0
        for (let utxo of ordenedUtxos) {
            if (utxoAmount <= amount+calculatedFee) {
                utxoAmount += utxo.value
                let scriptPubKey = Address.getScriptPubkey(wallet.address??"")
                transaction.addInput({
                    vout: utxo.vout,
                    txid: utxo.txid,
                    value: utxo.value,
                    scriptPubKey
                })
                calculatedFee = Math.ceil(recomendedFee * transaction.vBytes()) 
            } 
            else {
                // add the change recipient
                transaction.outputs.forEach(out => {
                    // the sender pay the fee
                    if(out.address == wallet.address) {
                        let outwithFee = utxoAmount-(amount-calculatedFee)
                        let outwithoutFee = utxoAmount-(amount+calculatedFee)
                        out.amount = wallet.payfee ? outwithFee : outwithoutFee 
                    }
                    // the receiver pay the fee
                    if(out.address != wallet.address && !wallet.payfee) {
                        out.amount = (out.amount-calculatedFee)
                    }
                })
                break
            }
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
        const txid = await sendTx(transactionHex, network)

        return { success: true, message: "", data: txid }
    }
    catch (ex) { 
        return trackException(ex) 
    }
}


