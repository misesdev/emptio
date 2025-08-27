import { AddressBalance, Balance } from "../wallet/types/Balance";
import { FeeRate } from "../wallet/types/FeeRate";
import { BTransaction } from "../wallet/types/Transaction";
import { Utxo } from "../wallet/types/Utxo"

interface IBlockChainService 
{    
    listBalance(addrs: string[]): Promise<Balance>;
    getBalance(address: string): Promise<AddressBalance>;

    getUtxos(address: string): Promise<Utxo[]>;
    listUtxos(addrs: string[]): Promise<Utxo[]>;
    
    getTransaction(txid: string, refAddress: string): Promise<BTransaction>;
    getTransactions(address: string): Promise<BTransaction[]>;
    listTransactions(addrs: string[]): Promise<BTransaction[]>;

    pushTransaction(tx: string): Promise<string>;
    
    getFeesRecommended(): Promise<FeeRate>;
    getBlockHeight(): Promise<number>;
}

export default IBlockChainService
