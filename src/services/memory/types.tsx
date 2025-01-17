import { Relay } from "nostr-tools"

export type PairKey = {
    key: string,
    privateKey: string,
    publicKey: string
}

export type WalletType = "lightning" | "bitcoin" | "testnet" | "emptio"

export type Wallet = {
    id?: number,
    name?: string,
    type?: WalletType,
    default?: boolean,
    lastBalance?: number,
    lastSended?: number,
    lastReceived?: number, 
    address?: string,
    pairkey?: string, 
    key?: string
}

export type Purchase = {
    title?: string
}

export type Sales = {
    title?: string
}

export type WalletInfo = {
    balance: number,
    received: number,
    sended: number,
    transactions: Transaction[]
}

export type TransactionInfo = {
    type?: "sended" | "received",
    amount?: number,
    date?: string,
    txid?: string
    confirmed?: boolean,
    inputs?: TransactionInput[],
    outputs?: TransactionOutput[]
}

export type TransactionInput = {
    amount?: number,
    address?: string,
    scriptPubkey?: string
}

export type TransactionOutput = {
    amount?: number,
    address?: string,
    scriptPubkey?: string
}

export type Transaction = {
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

export type User = {
    name?: string,
    pubkey?: string,
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
    similarity?: number
}

export type Settings = {
    useBiometrics?: boolean
}

export type Relays = Relay[]
