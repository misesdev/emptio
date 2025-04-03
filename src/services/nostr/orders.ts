import { hash256, numberToHex } from "bitcoin-tx-lib"
import { timeSeconds } from "../converter"
import { User } from "../memory/types"
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { DataOrderReputation, SellOrder } from "../types/order"
import useOrderStore from "../zustand/orders"
import useNDKStore from "../zustand/ndk"

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
    public created_at: number = 0
    public currency: string = "USD"
    private _ndk: NDK = useNDKStore.getState().ndk
    private _event: NDKEvent = useOrderStore.getState().event

    public constructor(user: User, { price, amount, currency, closure }: OrderProps) {
        this.price = price
        this.amount = amount
        this.currency = currency
        this.closure = closure
        this.user = user
    }

    public async publish() {
        let order = this.serialize()
       
        if(!this._event.content)
            this._event.content = "{}"

        if(!this._event.tags.length) 
        {
            let connectedRelays = this._ndk.pool.connectedRelays()
            this._event = new NDKEvent(this._ndk, {
                kind: 10002, // used relays
                pubkey: this.user.pubkey??"",
                tags: [
                    ["o", "orders"],
                    ...connectedRelays.map(r => {
                        return ["r", r.url]
                    })
                ],
                content: "{}",
                created_at: timeSeconds.now()
            })
        }

        if(!this._event.tags.some(t => t[0] == "o" && t[1] == "orders")) 
            this._event.tags.push(["o", "orders"])

        let data = JSON.parse(this._event.content) as DataOrderReputation
        
        data.orders = [order, ...data.orders.filter(o => o.id != order.id)]
       
        this._event.content = JSON.stringify(data)

        this._event.publishReplaceable() 
    }

    public getId() : string {
        this.created_at = timeSeconds.now()
        let pubkey_hex = this.user.pubkey ?? ""
        let price_hex = numberToHex(this.price, 64, "hex")
        let satoshis_hex = numberToHex(this.amount, 64, "hex")
        let created_at_hex = numberToHex(this.created_at, 64, "hex")
        let closure_hex = numberToHex(this.closure, 64, "hex")
        let id = hash256(pubkey_hex+created_at_hex+satoshis_hex+price_hex+closure_hex)
        return String(id)
    }

    private serialize() : SellOrder {
        return {
            id: this.getId(),
            price: this.price,
            amount: this.amount,
            currency: this.currency,
            created_at: this.created_at,
            closure: this.closure
        }
    }
}

