import { bytesToHex } from "@noble/hashes/utils"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { PairKey, Wallet } from "../memory/types"
import { getRandomKey } from "./signature"
import { getUtxos, sendTx } from "./mempool"
import { Response, trackException } from "../telemetry"
import { Address, BNetwork, ECPairKey, Transaction } from "bitcoin-tx-lib"
import { HDKey } from "@scure/bip32"

export interface BaseWallet {
    pairkey: PairKey;
    mnemonic: string;
    wallet: Wallet;
}

export const createWallet = (password: string = "", network: BNetwork = "mainnet"): BaseWallet => {

    const key = getRandomKey()

    const mnemonic = generateMnemonic(128)

    const seed = mnemonicToSeedSync(mnemonic, password)

    const root = HDKey.fromMasterSeed(seed)

    const privateKey = bytesToHex(root.privateKey as Uint8Array)

    const ecPairkey = ECPairKey.fromHex({ privateKey, network })

    const pairkey =  { key, privateKey, publicKey: ecPairkey.getPublicKeyCompressed("hex") }

    return { pairkey, mnemonic, wallet: {} }
}

export const importWallet = async (mnemonic: string, password?: string, network: BNetwork = "mainnet"): Promise<BaseWallet> => {
    
    const key = getRandomKey()

    const seed = mnemonicToSeedSync(mnemonic, password)

    const root = HDKey.fromMasterSeed(seed)

    const privateKey = bytesToHex(root.privateKey as Uint8Array)

    const ecPairkey = ECPairKey.fromHex({ privateKey, network })

    const pairkey =  { key, privateKey, publicKey: ecPairkey.getPublicKeyCompressed("hex") }

    return { pairkey, mnemonic, wallet: {} }
}

export const generateAddress = (publicKey: string, net: BNetwork = "mainnet"): string => {
    return Address.fromPubkey({ pubkey:  publicKey, network: net })
}

export const ValidateAddress = (btcAddress: string) => Address.isValid(btcAddress) 

interface TransactionProps {
    amount: number;
    destination: string;
    recomendedFee: number;
    pairkey: PairKey;
    wallet: Wallet;
}

export const createTransaction = async ({ amount, destination, recomendedFee,
    wallet, pairkey }: TransactionProps): Promise<Response<any>> => {
    try 
    {
        const ecPair = ECPairKey.fromHex({
            privateKey: pairkey.privateKey, 
            network: wallet.network
        })

        const selfAddress = ecPair.getAddress("p2wpkh")

        const transaction = new Transaction(ecPair, {
            whoPayTheFee: wallet.payfee ? selfAddress : destination,
            fee: recomendedFee
        })

        const utxos = await getUtxos(selfAddress, wallet.network as BNetwork)
        // ordenate for include all minimal value utxo of wallet
        const ordenedUtxos = utxos.sort((a, b) => a.value - b.value)
        // add destination address transaction, the amount is defined later
        transaction.addOutput({ address: destination, amount: amount })

        let calculatedFee = 0, utxoAmount = 0;
        for (let utxo of ordenedUtxos) 
        {
            if(transaction.inputs.some(i => i.txid == utxo.txid)) continue

            if (utxoAmount <= (amount+calculatedFee)) 
            {
                utxoAmount += utxo.value
                let scriptPubKey = Address.getScriptPubkey(selfAddress)
                transaction.addInput({
                    vout: utxo.vout, txid: utxo.txid, value: utxo.value, scriptPubKey
                })
                calculatedFee = transaction.getFeeSats()
                if(utxoAmount > (amount+calculatedFee)) 
                {
                    if(!transaction.outputs.some(o => o.address.includes(selfAddress))) {
                        transaction.addOutput({ 
                            address: selfAddress, amount: utxoAmount-amount
                        })
                    }
                    transaction.resolveFee()
                    break;
                }
            }  
        }

        if(utxoAmount <= amount)
            throw new Error("You do not have sufficient funds to complete the transaction.")
      
        return { success: true, message: "", data: transaction.build() }
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


