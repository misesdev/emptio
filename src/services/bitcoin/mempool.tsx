import mempool from "@mempool/mempool.js"
import { Tx } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions"
import { Transaction, WalletInfo } from "../memory/types"
import { useTranslate } from "../translate"
import env from "@/env"

const { bitcoin: { transactions, fees, addresses } } = mempool({
    hostname: env.mempool.hostname,
    network: env.mempool.network
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

export const getTransactionInfo = async (txid: string) => {

    const utxo : Tx = await getUtxo(txid)

    
    
}
