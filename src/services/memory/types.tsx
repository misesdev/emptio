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
    privateKey?: string,
    publicKey?: string
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