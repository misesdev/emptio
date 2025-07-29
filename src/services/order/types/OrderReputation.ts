import { UserReputation } from "../../user/types/UserReputation"
import { SellOrder } from "./SellOrder"

export type OrderReputation = {
    orders: SellOrder[],
    reputations: UserReputation[]
}
