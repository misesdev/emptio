import { AddressInstance } from "@mempool/mempool.js/lib/interfaces/bitcoin/addresses";
import { Tx, TxInstance } from "@mempool/mempool.js/lib/interfaces/bitcoin/transactions";
import { BlockInstance } from "@mempool/mempool.js/lib/interfaces/bitcoin/blocks";
import { FeeInstance } from "@mempool/mempool.js/lib/interfaces/bitcoin/fees";
import { MempoolReturn } from "@mempool/mempool.js/lib/interfaces";
import { DataBaseTransaction } from "@storage/database/DataBaseTransaction";
import { DataBaseUtxo } from "@storage/database/DataBaseUtxo";
import { BParticitant, BTransaction } from "./types/Transaction";
import { ITransactionService } from "./ITransactionService";
import mempool from "@mempool/mempool.js";
import { BNetwork } from "bitcoin-tx-lib";
import { FeeRate } from "./types/FeeRate";
import { UTXO } from "./types/Utxo";

export class TransactionService implements ITransactionService
{
    private readonly _utxoStorage: DataBaseUtxo;
    private readonly _storage: DataBaseTransaction; 
    private readonly _addresses: AddressInstance;
    private readonly _transactions: TxInstance;
    private readonly _blocks: BlockInstance;
    private readonly _fees: FeeInstance;
    
    constructor(
        network: BNetwork = "mainnet",
        utxoStorage: DataBaseUtxo = new DataBaseUtxo(),
        storage: DataBaseTransaction = new DataBaseTransaction()
    ) {
        const service: MempoolReturn = mempool({
            hostname: process.env.MEMPOOL_API_URL,
            network: network
        })
        this._storage = storage
        this._utxoStorage = utxoStorage
        this._addresses = service.bitcoin.addresses;
        this._transactions = service.bitcoin.transactions;
        this._blocks = service.bitcoin.blocks;
        this._fees = service.bitcoin.fees;
    }

    public async getUtxos(address: string, cached: boolean = false): Promise<UTXO[]> 
    {
        if(cached) {
            const utxos = await this._utxoStorage.list(address)
            return utxos
        }
        const utxos = await this._addresses.getAddressTxsUtxo({ address })
        const results = utxos.map((utxo): UTXO => ({
            txid: utxo.txid,
            address: address,
            vout: utxo.vout,
            value: utxo.value,
            confirmed: utxo.status.confirmed,
            block_height: utxo.status.block_height,
            block_hash: utxo.status.block_hash,
            block_time: utxo.status.block_time
        }))

        await this._utxoStorage.insertUpdateAsync(results)

        return results
    }

    public async getTransactions(address: string, cached: boolean = false): Promise<BTransaction[]> 
    {
        if(cached) {
            const txs = await this._storage.list(address) 
            return txs
        }
        const txs = await this._addresses.getAddressTxs({ address })
        const transactions = txs.map((tx) => this.extract(tx, address))
        await this._storage.insertUpdateAsync(transactions)
        return transactions
    }

    public async getTransaction(txid: string, cached: boolean = false): Promise<BTransaction|null> 
    {
        if(cached) {
            return await this._storage.getByTxid(txid)
        }
        const tx = await this._transactions.getTx({ txid })
        const transaction = this.extract(tx) // fix this issue
        return transaction
    }

    public async send(txhex: string): Promise<string> 
    {
        const response = await this._transactions.postTx({ txhex })
        return response as string
    }

    public async getFeeRate(): Promise<FeeRate> 
    {
        const fees = await this._fees.getFeesRecommended()
        return fees as FeeRate
    }

    public async blocksHight(): Promise<number> 
    {
        return await this._blocks.getBlocksTipHeight()
    }

    private extract(tx: Tx, address?: string): BTransaction 
    {
        if(!address)
            address = tx.vin[0].prevout.scriptpubkey_address

        const participants: BParticitant[] = [];
        const receiving = tx.vout.some(t => t.scriptpubkey_address == address)
        let inValue = tx.vout.reduce((sum, v) => {
            participants.push({
                type: "output",
                txid: tx.txid,
                address: v.scriptpubkey_address,
                value: v.value
            })
            if(v.scriptpubkey_address == address) 
                return v.value + sum
            return sum
        }, 0)

        let outValue = tx.vin.reduce((sum, v) => {
            participants.push({
                type: "input",
                txid: tx.txid,
                address: v.prevout.scriptpubkey_address,
                value: v.prevout.value
            })
            if(v.prevout.scriptpubkey_address == address)
                return sum + v.prevout.value
            return sum
        }, 0)

        return {
            txid: tx.txid,
            value: receiving ? outValue : (inValue - outValue - tx.fee),
            type: receiving ? "received" : "sent",
            confirmed: tx.status.confirmed,
            block_height: tx.status.block_height,
            block_time: tx.status.block_time,
            block_hash: tx.status.block_hash,
            participants,
            fee: tx.fee
        } 
    }
}
