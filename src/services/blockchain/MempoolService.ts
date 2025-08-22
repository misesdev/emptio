import IBlockChainService, { BlockChainAddress,
    PushTxProps, SyncBlockChainProps, TxProps } from "./IBlockChainService";
import { BTransaction } from "../wallet/types/Transaction";
import { Balance } from "../wallet/types/Balance";
import { Utxo } from "../wallet/types/Utxo";
import { BNetwork } from "bitcoin-tx-lib";

class MempoolService implements IBlockChainService
{
    public async getUtxos({ 
        address, network="mainnet" 
    }: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<Utxo[]> 
    {
        const apiUrl = this.getApiUrl(network) 

        return []
    }

    public async listUtxos({ 
        addrs, network="mainnet" 
    }: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<Utxo[]> 
    {
        const apiUrl = this.getApiUrl(network) 

        return []
    }

    public async getBalance({ 
        address, network="mainnet" 
    }: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<Balance> 
    {
        return {} as Balance
    }

    public async listBalance({ 
        addrs, network="mainnet"
    }: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<Balance>
    {
        const apiUrl = this.getApiUrl(network) 

        return {} as Balance
    }

    public async getTransaction({ txid, network="mainnet" }: TxProps): Promise<BTransaction> 
    {
        const apiUrl = this.getApiUrl(network) 

        return {} as BTransaction
    }

    public async getTransactions({ 
        address, network="mainnet" 
    }: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<BTransaction[]> 
    {
        const apiUrl = this.getApiUrl(network)

        return []
    }

    public async listTransactions({
        addrs, network="mainnet" 
    }: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<BTransaction[]> 
    {
        const apiUrl = this.getApiUrl(network) 

        return []
    }

    public async pushTransaction({
        tx, network="mainnet"
    }: PushTxProps): Promise<string>
    {
        const apiUrl = this.getApiUrl(network) 

        return "txid"
    }

    public async sync({ 
        addrs, network="mainnet", onTransactions 
    }: SyncBlockChainProps): Promise<void> 
    {

    }

    private getApiUrl(network: BNetwork="mainnet"): string
    {
        return network=="mainnet" ? process.env.MEMPOOL_MAIN as string : 
            process.env.MEMPOOL_TESTNET as string;
    }
}

const service = new MempoolService()

service.listUtxos({ addrs: [], network: "mainnet" })
export default MempoolService
