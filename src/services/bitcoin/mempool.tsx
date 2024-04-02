import mempool from "@mempool/mempool.js"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { Transaction, WalletInfo } from "../memory/types"

const { bitcoin: { transactions, fees, addresses } } = mempool({
    hostname: "mempool.space",
    network: "testnet" // "mainnet"
})

export const sendUtxo = async (txhex: string) => await transactions.postTx({ txhex })

export const getUtxos = async (address: string) => await addresses.getAddressTxs({ address })

export const getUtxo = async (txid: string) => await transactions.getTx({ txid })

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
            type: utxo.vout[0].scriptpubkey_address == address ? "received" : "sended",
            amount: utxo.vout[0].scriptpubkey_address == address ? received : sended,
            date: new Date(utxo.status.block_time * 1000).toLocaleTimeString()
        }

        response.transactions.push(transaction)
        response.received += received
        response.sended += sended
    })

    response.balance = response.received - response.sended

    return response
}

export const getTransactionInfo = async (txid: string) => {

    const utxo = await getUtxo(txid)

    
}