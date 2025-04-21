import { BNetwork } from "bitcoin-tx-lib"

export interface SellOrder {
    id: string,
    currency: string,
    price: number,
    amount: number,
    created_at: number,
    closure: number,
    network: BNetwork,
    author?: string,
    relays?: string[]
}

export interface UserReputation {
    pubkey: string,
    safe_seller: boolean,
    about: string,
    author?: string,
    relays?: string[]
}

export interface DataOrderReputation {
    orders: SellOrder[],
    reputations: UserReputation[]
}
