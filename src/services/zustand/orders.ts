import { Order, Reputation } from "../types/order";
import { create } from "zustand"

interface OrderStore {
    orders: Order[],
    addOrder: (order: Order) => void
    removeOrder: (order: Order) => void
    reputations: Reputation[],
    addReputation: (reputation: Reputation) => void
    removeReputation: (reputation: Reputation) => void
}

const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    reputations: [],
    addOrder: (order: Order) => set((state) => ({
        orders: [order, ...state.orders]
    })),
    removeOrder: (order: Order) => set((state) => ({
        orders: [...state.orders.filter(o => o.id != order.id)]
    })),
    addReputation: (reputation: Reputation) => set((state) => {
        if(state.reputations.some(r => r.pubkey == reputation.pubkey && r.author == reputation.author)) {
            return {
                reputations: [
                    ...state.reputations.map(item => {
                        if(item.pubkey == reputation.pubkey && item.author == reputation.author) {
                            item.safe_seller = reputation.safe_seller
                            item.about = reputation.about
                        }
                        return item
                    })
                ]
            }
        }

        return {
            reputations: [...state.reputations, reputation]
        }
    }),
    removeReputation: (reputation: Reputation) => set((state) => ({
        reputations: [
            ...state.reputations.filter(r => r.author == reputation.author && r.pubkey == reputation.pubkey)
        ]
    }))
}))

export default useOrderStore
