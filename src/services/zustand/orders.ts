import { Order } from "../types/order";
import { create } from "zustand"

interface OrderStore {
    orders: Order[],
    addOrder: (order: Order) => void
    removeOrder: (order: Order) => void
}

const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    addOrder: (order: Order) => set((state) => ({
        orders: [...state.orders, order]
    })),
    removeOrder: (order: Order) => set((state) => ({
        orders: [...state.orders.filter(o => o.id != order.id)]
    }))
}))

export default useOrderStore
