import { Relay } from "nostr-tools"

export type SecreteKeys = {
    privateKey: string,
    publicKey?: string
}

export type HexPairKeys = {
    privateKey: string,
    publicKey: string
}

export type Wallet = {
    id?: number,
    name?: string,
    type?: "lightning" | "bitcoin",
    lastBalance?: number,
    privateKey?: string,
    publicKey?: string
    address?: string
}

export type Purchase = {
    title?: string
}

export type Sales = {
    title?: string
}

export type Transaction = {
    to?: string,
    from?: string,
    addressTo?: string,
    addressFrom?: string,
    type?: "sended" | "received",
    description?: string,
    amount?: number,
    date?: string
}

export type User = {
    name?: string,
    displayName?: string,
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
    privateKey: string,
    publicKey: string,
}

export type Relays = Relay[]