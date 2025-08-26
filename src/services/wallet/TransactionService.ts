import { DataBaseTransaction } from "@storage/database/DataBaseTransaction";
import { DataBaseUtxo } from "@storage/database/DataBaseUtxo";
import { BTransaction } from "./types/Transaction";
import { ITransactionService } from "./ITransactionService";
import MempoolService from "../blockchain/MempoolService";
import { BNetwork } from "bitcoin-tx-lib";
import { FeeRate } from "./types/FeeRate";
import { Utxo } from "./types/Utxo";

export default class TransactionService implements ITransactionService
{
    private readonly _utxoStorage: DataBaseUtxo;
    private readonly _storage: DataBaseTransaction; 
    private readonly _mempool: MempoolService;
    constructor(
        network: BNetwork = "mainnet",
        utxoStorage: DataBaseUtxo = new DataBaseUtxo(),
        storage: DataBaseTransaction = new DataBaseTransaction()
    ) {
        this._storage = storage
        this._utxoStorage = utxoStorage
        this._mempool = new MempoolService(network)
    }

    public async getUtxos(address: string, cached: boolean = false): Promise<Utxo[]> 
    {
        if(cached) {
            const utxos = await this._utxoStorage.list(address)
            return utxos
        }
        const utxos = await this._mempool.getUtxos(address)

        await this._utxoStorage.insertUpdateAsync(utxos)

        return utxos
    }

    public async allTransactions(): Promise<BTransaction[]>
    {
        return await this._storage.all()
    }

    public async getTransactions(address: string, cached: boolean = false): Promise<BTransaction[]> 
    {
        if(cached) 
            return await this._storage.list(address) 
        
        const transactions = await this._mempool.getTransactions(address) 
        await this._storage.insertUpdateAsync(transactions)
        return transactions
    }

    public async getTransaction(txid: string, cached: boolean = false): Promise<BTransaction|null> 
    {
        if(cached) {
            return await this._storage.getByTxid(txid)
        }
        const transaction = await this._mempool.getTransaction(txid) 
        return transaction
    }

    public async send(txhex: string): Promise<string> 
    {
        const txid = await this._mempool.pushTransaction(txhex)
        return txid as string
    }

    public async getFeeRate(): Promise<FeeRate> 
    {
        const fees = await this._mempool.getFeesRecommended()
        return fees 
    }

    public async blocksHight(): Promise<number> 
    {
        return await this._mempool.getBlockHeight()
    }

    // private extract(tx: Tx, address?: string): BTransaction 
    // {
    //     if(!address)
    //         address = tx.vin[0].prevout.scriptpubkey_address

    //     const participants: BParticitant[] = [];
    //     const receiving = tx.vout.some(t => t.scriptpubkey_address == address)
    //     let inValue = tx.vout.reduce((sum, v) => {
    //         participants.push({
    //             type: "output",
    //             txid: tx.txid,
    //             address: v.scriptpubkey_address,
    //             value: v.value
    //         })
    //         if(v.scriptpubkey_address == address) 
    //             return v.value + sum
    //         return sum
    //     }, 0)

    //     let outValue = tx.vin.reduce((sum, v) => {
    //         participants.push({
    //             type: "input",
    //             txid: tx.txid,
    //             address: v.prevout.scriptpubkey_address,
    //             value: v.prevout.value
    //         })
    //         if(v.prevout.scriptpubkey_address == address)
    //             return sum + v.prevout.value
    //         return sum
    //     }, 0)

    //     return {
    //         txid: tx.txid,
    //         value: receiving ? outValue : (inValue - outValue - tx.fee),
    //         type: receiving ? "received" : "sent",
    //         confirmed: tx.status.confirmed,
    //         block_height: tx.status.block_height,
    //         block_time: tx.status.block_time,
    //         block_hash: tx.status.block_hash,
    //         participants,
    //         fee: tx.fee
    //     } 
    // }
}
