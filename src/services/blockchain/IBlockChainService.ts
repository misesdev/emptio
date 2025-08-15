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

export type BlockChainProps = {
    network?: BNetwork;
    addrs: string[];
}

interface IBlockChainService {
    getUtxos(props: BlockChainProps): Promise<Utxo[]>;
    getBalance(props: BlockChainProps): Promise<Balance>;

    getTransaction(props: TxProps): Promise<BTransaction>;
    listTransactions(props: BlockChainProps): Promise<BTransaction[]>;

    pushTransaction(props: PushTxProps): Promise<string>;
}

export default IBlockChainService
