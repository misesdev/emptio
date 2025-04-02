
export interface Order {
    id: string,
    pubkey: string,
    currency: string,
    price: number,
    satoshis: number,
    closure: number
}

export interface Reputation {
    pubkey: string,
    author: string,
    safe_seller: boolean,
    about: string
}
