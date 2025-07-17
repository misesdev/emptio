import { NDKEvent } from "@nostr-dev-kit/ndk-mobile";
import { SellOrder, UserReputation } from "../types/order";
import { create } from "zustand"

interface OrderStore {
    event: NDKEvent,
    setEvent: (event: NDKEvent) => void,
    orders: SellOrder[],
    addOrder: (order: SellOrder) => void
    removeOrder: (order: SellOrder) => void
    reputations: UserReputation[],
    addReputation: (reputation: UserReputation) => void
    removeReputation: (reputation: UserReputation) => void
}

const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    reputations: [],
    event: new NDKEvent(),
    setEvent: (event: NDKEvent) => set({ event }),
    addOrder: (order: SellOrder) => set((state) => {
        return {
            orders: [order, ...state.orders.filter(o => o.id != order.id)]
        }
    }),
    removeOrder: (order: SellOrder) => set((state) => ({
        orders: [...state.orders.filter(o => o.id != order.id)]
    })),
    addReputation: (reputation: UserReputation) => set((state) => {
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
            reputations: [
                reputation,
                ...state.reputations.filter(r => r.pubkey != reputation.pubkey && r.author != reputation.author)]
        }
    }),
    removeReputation: (reputation: UserReputation) => set((state) => ({
        reputations: [
            ...state.reputations.filter(r => r.author == reputation.author && r.pubkey == reputation.pubkey)
        ]
    }))
}))

export default useOrderStore
