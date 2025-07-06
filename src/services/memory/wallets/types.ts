import { BNetwork } from "bitcoin-tx-lib";

export interface Wallet {
    name?: string;
    default?: boolean;
    lastBalance?: number;
    lastSended?: number;
    lastReceived?: number;
    network?: BNetwork;
    payfee?: boolean;
    privateKey: Uint8Array;
}

export interface WalletInfo {
    balance: number,
    received: number,
    sended: number,
    transactions: Transaction[]
}

export interface TransactionInfo {
    type?: "sended" | "received",
    amount?: number,
    date?: string,
    txid?: string
    confirmed?: boolean,
    inputs?: TransactionInput[],
    outputs?: TransactionOutput[]
}

export interface TransactionInput {
    amount?: number,
    address?: string,
    scriptPubkey?: string
}

export interface TransactionOutput {
    amount?: number,
    address?: string,
    scriptPubkey?: string
}

export interface Transaction {
    type?: "sended" | "received",
    description?: string,
    amount?: number,
    date?: string,
    txid?: string
    confirmed?: boolean,
    timestamp?: number,
    fee?: number,
    size?: number,
    block_height?: number,
    inputs?: TransactionInput[],
    outputs?: TransactionOutput[]
}
