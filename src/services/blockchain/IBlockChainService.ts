import { BNetwork } from "bitcoin-tx-lib";
import { Balance } from "../wallet/types/Balance";
import { BTransaction } from "../wallet/types/Transaction";
import { Utxo } from "../wallet/types/Utxo"

export type BlockChainTxProps = {
    tx: string;
    network?: BNetwork;
    txid: string;
}

export type BlockChainAddress = {
    addrs: string[];
    address: string;
    network?: BNetwork;
}

interface IBlockChainService 
{    
    getBalance(props: Pick<BlockChainAddress, "address"|"network">): Promise<Balance>;
    listBalance(props: Pick<BlockChainAddress, "addrs"|"network">): Promise<Balance>;

    getUtxos(props: Pick<BlockChainAddress, "address"|"network">): Promise<Utxo[]>;
    listUtxos(props: Pick<BlockChainAddress, "addrs"|"network">): Promise<Utxo[]>;
    
    getTransaction(props: Pick<BlockChainTxProps, "txid"|"network">): Promise<BTransaction>;
    getTransactions(props: Pick<BlockChainAddress, "address"|"network">): Promise<BTransaction[]>;
    listTransactions(props: Pick<BlockChainAddress, "addrs"|"network">): Promise<BTransaction[]>;

    pushTransaction(props: Pick<BlockChainTxProps, "tx"|"network">): Promise<string>;
}

export default IBlockChainService
