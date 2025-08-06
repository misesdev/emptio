import { AppResponse } from "../telemetry";
import { BNetwork } from "bitcoin-tx-lib";
import { StoredItem } from "@storage/types";
import { Wallet } from "./types/Wallet";
import { BTransaction } from "./types/Transaction";
import { UTXO } from "./types/Utxo";
import { FeeRate } from "./types/FeeRate";

export type AddWalletProps = {
    name: string; masterKey: Uint8Array; network?: BNetwork;
}
export type SendTransactionProps = {
    address: string; value: number; estimatedFee: number;
}

export interface IWalletService {
    add(props: AddWalletProps): Promise<AppResponse<StoredItem<Wallet>>>;
    update(id: string, wallet: Wallet): Promise<AppResponse<string>>;
    delete(id: string): Promise<AppResponse<string>>;
    list(): Promise<StoredItem<Wallet>[]>;
    get(id: string): Promise<Wallet>;

    getFeeRate(): Promise<AppResponse<FeeRate>>;
    getBlockHeight(): Promise<AppResponse<number>>;
    listUtxos(cached?: boolean): Promise<AppResponse<UTXO[]>>;
    listTransactions(cached?: boolean): Promise<AppResponse<BTransaction[]>>;
    send(props: SendTransactionProps): Promise<AppResponse<string>>;
}
