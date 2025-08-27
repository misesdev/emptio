import { DataBaseTransaction } from "@storage/database/DataBaseTransaction";
import { DataBaseUtxo } from "@storage/database/DataBaseUtxo";
import { BTransaction } from "./types/Transaction";
import { ITransactionService } from "./ITransactionService";
import MempoolService from "../blockchain/MempoolService";
import { BNetwork } from "bitcoin-tx-lib";
import { FeeRate } from "./types/FeeRate";
import { Utxo } from "./types/Utxo";

class TransactionService implements ITransactionService
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
}

export default TransactionService
