import mempool from "@mempool/mempool.js"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { Transaction, TransactionInput, TransactionOutput } from "../memory/types"
import { useTranslate } from "../translate"
import { BNetwork } from "bitcoin-tx-lib"

// post a transaction
export const sendTx = async (txhex: string, network: BNetwork) => { 
    const { bitcoin: { transactions } } = mempool({
        hostname: process.env.MEMPOOL_API_URL,
        network: network
    })

    return await transactions.postTx({ txhex })
}

// find all utxos
export const getUtxos = async (address: string, network: BNetwork) => { 
    const { bitcoin: { addresses } } = mempool({
        hostname: process.env.MEMPOOL_API_URL,
        network: network
    })

    return await addresses.getAddressTxs({ address })
}

// find unspent cash
export const getTxsUtxos = async (address: string, network: BNetwork) => {

    const { bitcoin: { addresses } } = mempool({
        hostname: process.env.MEMPOOL_API_URL,
        network: network
    })
    
    return await addresses.getAddressTxsUtxo({ address })
}

// find specific utxo
export const getTx = async (txid: string, network: BNetwork) => { 
    const { bitcoin: { transactions } } = mempool({
        hostname: process.env.MEMPOOL_API_URL,
        network: network
    })

    return await transactions.getTx({ txid })
}

// Find current transaction rates
export const getFee = async (network: BNetwork) => {
    const { bitcoin: { fees } } = mempool({
        hostname: process.env.MEMPOOL_API_URL,
        network: network
    })

    return await fees.getFeesRecommended()
}

interface TxProps {
    txid: string,
    network: BNetwork,
    address: string
}

export const getTransactionInfo = async ({ txid, network, address }: TxProps) => {

    const utxo : Tx = await getTx(txid, network)

    let received: number = 0, sended: number = 0

    let isSended: boolean = utxo.vin.filter(i => { 
        return i.prevout.scriptpubkey_address == address
    }).length > 0

    utxo.vin.forEach(tx => {
        if(tx.prevout.scriptpubkey_address == address) sended += tx.prevout.value
    })

    utxo.vout.forEach((tx) => {
        if (tx.scriptpubkey_address == address) received += tx.value
    })

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
        description: utxo.status.confirmed ? 
            await useTranslate("message.transaction.confirmed") : 
            await useTranslate("message.transaction.notconfirmed"),
        amount: isSended ? (sended-received)+utxo.fee : received,
        value: isSended ? sended : received,
        date: utxo.status.confirmed ? 
            new Date(utxo.status.block_time * 1000).toLocaleString() : 
            await useTranslate("message.transaction.notconfirmed"),
        timestamp: utxo.status.confirmed ? utxo.status.block_time : Date.now(),
        inputs: inputs,
        outputs: outputs
    }

    return transaction
}
