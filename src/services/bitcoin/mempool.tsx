import mempool from "@mempool/mempool.js"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { Transaction, WalletInfo } from "../memory/types"
import { useTranslate } from "../translate"

const { bitcoin: { transactions, fees, addresses } } = mempool({
    hostname: 'mempool.space',
    network: 'testnet' // "mainnet"
})

// post a transaction
export const sendUtxo = async (txhex: string) => await transactions.postTx({ txhex })

// find all utxos
export const getUtxos = async (address: string) => await addresses.getAddressTxs({ address })

// find unspent cash
export const getTxsUtxos = async (address: string) => await addresses.getAddressTxsUtxo({ address })

// find specific utxo
export const getUtxo = async (txid: string) => await transactions.getTx({ txid })

// Find current transaction rates
export const getFee = async () => await fees.getFeesRecommended()

export const getWalletInfo = async (address: string): Promise<WalletInfo> => {

    const response: WalletInfo = { balance: 0, sended: 0, received: 0, transactions: [] }

    const utxos: Tx[] = await getUtxos(address)

    utxos.forEach(utxo => {
        let received = utxo.vout.reduce((acumulator, tx) => {
            if (tx.scriptpubkey_address == address)
                return acumulator + tx.value
            else
                return acumulator
        }, 0)

        let sended = utxo.vin.reduce((acumulator, tx) => {
            if (tx.prevout.scriptpubkey_address == address)
                return acumulator + tx.prevout.value
            else
                return acumulator
        }, 0)

        const transaction: Transaction = {
            txid: utxo.txid,
            confirmed: utxo.status.confirmed,
            description: utxo.status.confirmed ? useTranslate("message.transaction.confirmed") : useTranslate("message.transaction.notconfirmed"),
            type: received > sended ? "received" : "sended",
            amount: received > sended ? received : sended, 
            date: utxo.status.confirmed ? new Date(utxo.status.block_time * 1000).toLocaleString() : useTranslate("message.transaction.notconfirmed")
        }

        response.transactions.push(transaction)
        response.received += received
        response.sended += sended
    })

    response.balance = response.received - response.sended

    console.log("wallet balance", response.balance)

    return response
}

export const getTransactionInfo = async (txid: string) => {

    const utxo : Tx = await getUtxo(txid)

    
    
}