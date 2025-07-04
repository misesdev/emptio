import { Currency } from "@/src/constants/Currencies"
import { BNetwork } from "bitcoin-tx-lib"
import { Relay } from "nostr-tools"

export interface PairKey {
    key: string,
    privateKey: string,
    publicKey: string
}

export interface Secret {
    key: string,
    value: string
}

export interface PaymentKey {
    key: string,
    secret: string
}

export interface Wallet {
    id?: number,
    name?: string,
    default?: boolean,
    lastBalance?: number,
    lastSended?: number,
    lastReceived?: number,
    network?: BNetwork,
    payfee?: boolean,
    address?: string,
    pairkey?: string, 
    key?: string
}

export interface Purchase {
    title?: string
}

export interface Sales {
    title?: string
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

export interface FeedVideosSettings {
    VIDEOS_LIMIT: number,
    FETCH_LIMIT: number,
    filterTags: string[],
}

export type Settings = {
    useBiometrics?: boolean,
    currency?: Currency
}

export type Relays = Relay[]
