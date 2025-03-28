import { BNetwork, InputTransaction, OutputTransaction } from "bitcoin-tx-lib"
import { Relay } from "nostr-tools"

export interface PairKey {
    key: string,
    privateKey: string,
    publicKey: string
}

export type WalletType = "lightning" | "bitcoin" | "testnet" | "emptio"

export interface Wallet {
    id?: number,
    name?: string,
    type?: WalletType,
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
    inputs?: InputTransaction[],
    outputs?: OutputTransaction[]
}

export interface Transaction {
    type?: "sended" | "received",
    description?: string,
    amount?: number,
    value?: number,
    date?: string,
    txid?: string
    confirmed?: boolean,
    timestamp?: number,
    fee?: number,
    size?: number,
    block_height?: number,
    inputs?: InputTransaction[],
    outputs?: OutputTransaction[]
}

export interface User {
    name?: string,
    pubkey?: string,
    displayName?: string,
    display_name?: string,
    picture?: string,
    image?: string,
    about?: string,
    bio?: string,
    nip05?: string,
    lud06?: string,
    lud16?: string,
    banner?: string,
    zapService?: string,
    website?: string,
    keychanges?: string,
    default_wallet?: string,
    bitcoin_address?: string,
    similarity?: number,
    friend?: boolean
}

export interface FeedVideosSettings {
    VIDEOS_LIMIT: number,
    FETCH_LIMIT: number,
    filterTags: string[],
}

export type Settings = {
    useBiometrics?: boolean
}

export type Relays = Relay[]
