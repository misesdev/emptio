import IBlockChainService, { BlockChainProps, PushTxProps, TxProps } from "./IBlockChainService";
import { BTransaction } from "../wallet/types/Transaction";
import { Balance } from "../wallet/types/Balance";
import { Utxo } from "../wallet/types/Utxo";

class MempoolService implements IBlockChainService
{
    public async getUtxos({ addrs, network="mainnet" }: BlockChainProps): Promise<Utxo[]> 
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return []
    }

    public async getBalance({ addrs, network="mainnet" }: BlockChainProps): Promise<Balance>
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return {} as Balance
    }

    public async getTransaction({ txid, network="mainnet" }: TxProps): Promise<BTransaction> 
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return {} as BTransaction
    }

    public async listTransactions({ addrs, network="mainnet" }: BlockChainProps): Promise<BTransaction[]> 
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return []
    }

    public async pushTransaction({ tx, network="mainnet" }: PushTxProps): Promise<string>
    {
        const apiUrl = network=="mainnet" ? 
            process.env.MEMPOOL_MAIN : process.env.MEMPOOL_TESTNET;

        return "txid"
    }
}

export default MempoolService
