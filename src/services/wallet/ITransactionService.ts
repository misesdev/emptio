import { BNetwork } from "bitcoin-tx-lib";
import { BTransaction, FeeRate, UTXO } from "./types";

export type TXProps = { txid: string; network: BNetwork; }
export type AddressProps = { address: string; network: BNetwork; }

export interface ITransactionService {
    getUtxos(address: string): Promise<UTXO[]>;
    getTransaction(txid: string): Promise<BTransaction>;
    getTransactions(address: string): Promise<BTransaction[]>;
    send(txHex: string): Promise<string>;
    blocksHight(): Promise<number>;
    getFeeRate(): Promise<FeeRate>;
}
