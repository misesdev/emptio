
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
    display_name?: string,
    displayName?: string,
    picture?: string,
    about?: string,
    lud16?: string,
    banner?: string,
    privateKey?: string,
    publicKey?: string,
}

export type Relays = string[]