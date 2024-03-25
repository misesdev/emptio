
export type SecreteKeys = {
    privateKey: string,
    publicKey?: string
}

export type Wallet = {
    privateKey?: string,
    publicKey?: string
}

export type User = {
    userName?: string,
    privateKey?: string,
    publicKey?: string,
    profile?: string,
    wallet?: Wallet
}

export type Relays = string[]