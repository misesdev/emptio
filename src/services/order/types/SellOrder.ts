import { BNetwork } from "bitcoin-tx-lib";

export type SellOrder = {
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
