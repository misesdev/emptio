import { BNetwork } from "bitcoin-tx-lib";
import { UTXO } from "./types/Utxo";
import { BTransaction } from "./types/Transaction";
import { FeeRate } from "./types/FeeRate";

export type TXProps = { txid: string; network: BNetwork; }
export type AddressProps = { address: string; network: BNetwork; }

export interface ITransactionService {
    getFeeRate(): Promise<FeeRate>;
    blocksHight(): Promise<number>;
    getUtxos(address: string, cached?: boolean): Promise<UTXO[]>;
    getTransaction(txid: string, cached?: boolean): Promise<BTransaction|null>;
    getTransactions(address: string, cached?: boolean): Promise<BTransaction[]>;
    send(txHex: string): Promise<string>;
}
