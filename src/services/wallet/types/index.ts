
import { BNetwork } from "bitcoin-tx-lib";

export interface Wallet {
    name?: string;
    mnemonic?: string;
    default?: boolean;
    lastBalance?: number;
    lastSended?: number;
    lastReceived?: number;
    network?: BNetwork;
    payfee?: boolean;
    keyRef: string;
}

export type UTXO = {
    txid: string;
    value: number;
    vout: number;
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
}

export type BTransaction = {
    txid: string;
    value: number;
    fee: number;
    confirmed: boolean;
    block_height: number;
    block_time: number;
    type: "sent" | "received";
    address: string;
}

export type FeeRate = {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
}
