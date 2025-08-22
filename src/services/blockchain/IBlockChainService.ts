import { BNetwork } from "bitcoin-tx-lib";
import { Balance } from "../wallet/types/Balance";
import { BTransaction } from "../wallet/types/Transaction";
import { Utxo } from "../wallet/types/Utxo"

export type PushTxProps = {
    network?: BNetwork;
    tx: string;
}

export type TxProps = {
    network?: BNetwork;
    txid: string;
}

export type BlockChainAddress = {
    addrs?: string[];
    address?: string;
    network?: BNetwork;
}

export type SyncBlockChainProps = {
    addrs: string[];
    network?: BNetwork;
    onTransactions: () => BTransaction[];
}

interface IBlockChainService 
{    
    getBalance(props: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<Balance>;
    listBalance(props: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<Balance>;

    getUtxos(props: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<Utxo[]>;
    listUtxos(props: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<Utxo[]>;
    
    getTransactions(props: Required<Pick<BlockChainAddress, "address"|"network">>): Promise<BTransaction[]>;
    listTransactions(props: Required<Pick<BlockChainAddress, "addrs"|"network">>): Promise<BTransaction[]>;

    getTransaction(props: TxProps): Promise<BTransaction>;
    pushTransaction(props: PushTxProps): Promise<string>;
    
    sync(props:  SyncBlockChainProps): Promise<void>;
}

export default IBlockChainService
