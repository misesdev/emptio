import { hash256, numberToHex } from "bitcoin-tx-lib"
import { timeSeconds } from "../converter"
import { User } from "../memory/types"

interface OrderProps {
    price: number,
    amount: number,
    currency: string,
    closure: number
}

export class Order {
    public user: User = {}
    public price: number = 0
    public amount: number = 0
    public closure: number = 0
    public currency: string = "USD"

    public constructor(user: User, { price, amount, currency, closure }: OrderProps) {
        this.price = price
        this.amount = amount
        this.currency = currency
        this.closure = closure
        this.user = user
    }

    public getId() {
        let pubkey_hex = this.user.pubkey ?? ""
        let price_hex = numberToHex(this.price, 32, "hex")
        let satoshis_hex = numberToHex(this.amount, 32, "hex")
        let created_at_hex = numberToHex(timeSeconds.now(), 32, "hex")
        let closure_hex = numberToHex(this.closure, 32, "hex")
        return hash256(pubkey_hex+created_at_hex+satoshis_hex+price_hex+closure_hex)
    }

    public async publish() {
         
    }
}

