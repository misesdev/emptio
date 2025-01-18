import mempool from "@mempool/mempool.js"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { Transaction, TransactionInput, TransactionOutput, WalletInfo } from "../memory/types"
import { useTranslate } from "../translate"
import env from "@/env"
import { Network } from "./types"

// post a transaction
export const sendUtxo = async (txhex: string, network: Network) => { 
    const { bitcoin: { transactions } } = mempool({
        hostname: env.mempool.hostname,
        network: network
    })

    return await transactions.postTx({ txhex })
}

// find all utxos
export const getUtxos = async (address: string, network: Network) => { 
    const { bitcoin: { addresses } } = mempool({
        hostname: env.mempool.hostname,
        network: network
    })

    return await addresses.getAddressTxs({ address })
}

// find unspent cash
export const getTxsUtxos = async (address: string, network: Network) => {

    console.log("instancing mempoll")
    const { bitcoin: { addresses } } = mempool({
        hostname: env.mempool.hostname,
        network: network
    })
    
    console.log("list utxos")
    return await addresses.getAddressTxsUtxo({ address })
}

// find specific utxo
export const getUtxo = async (txid: string, network: Network) => { 
    const { bitcoin: { transactions } } = mempool({
        hostname: env.mempool.hostname,
        network: network
    })

    return await transactions.getTx({ txid })
}

// Find current transaction rates
export const getFee = async (network: Network) => {
    const { bitcoin: { fees } } = mempool({
        hostname: env.mempool.hostname,
        network: network
    })

    return await fees.getFeesRecommended()
}

export const getTransactionInfo = async (txid: string, network: Network) => {

    const utxo : Tx = await getUtxo(txid, network)

    var amount: number = 0
    utxo.vout.forEach(tx => amount += tx.value)

    var inputs: TransactionInput[] = utxo.vin.map((item): TransactionInput => { 
        return {
            address: item.prevout.scriptpubkey_address,
            scriptPubkey: item.prevout.scriptpubkey,
            amount: item.prevout.value
        }
    })  

    var outputs: TransactionOutput[] = utxo.vout.map((item): TransactionOutput => { 
        return {
            address: item.scriptpubkey_address,
            scriptPubkey: item.scriptpubkey,
            amount: item.value
        }
    }) 

    const transaction: Transaction = {
        txid: utxo.txid,
        fee: utxo.fee,
        size: utxo.size,
        confirmed: utxo.status.confirmed,
        block_height: utxo.status.block_height,
        description: utxo.status.confirmed ? useTranslate("message.transaction.confirmed") : useTranslate("message.transaction.notconfirmed"),
        amount: amount,
        date: utxo.status.confirmed ? new Date(utxo.status.block_time * 1000).toLocaleString() : useTranslate("message.transaction.notconfirmed"),
        timestamp: utxo.status.confirmed ? utxo.status.block_time : Date.now(),
        inputs: inputs,
        outputs: outputs
    }

    return transaction
}
