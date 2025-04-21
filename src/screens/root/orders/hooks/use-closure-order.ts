import { useAuth } from "@src/providers/userProvider"
import { timeSeconds, toNumber } from "@services/converter"
import { Order } from "@services/nostr/orders"
import { useState } from "react"

const useClosureOrder = ({ navigation, route }: any) => {

    const { user } = useAuth() 
    const { satoshis, wallet, price, currency } = route.params
    const [closure, _setClosure] = useState<number>(timeSeconds.now())
    const [loading, setLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const setClosure = (value: number) => {
        _setClosure(Math.floor(value/1000))
        setDisabled(value <= timeSeconds.now())
    }

    const publishOrder = async () => {
        setLoading(true)
        setDisabled(true)

        // pulish order implemenmtation
        const order = new Order(user, {
            price: toNumber(price),
            amount: toNumber(satoshis),
            network: wallet.network ?? "testnet",
            closure,
            currency
        })

        await order.publish()

        navigation.reset({ 
            index: 1, 
            routes: [
                { name: "core-stack" },
                { name: "orders-stack" },
            ] 
        })

        setDisabled(false)
        setLoading(false)
    }

    return {
        loading,
        disabled,
        satoshis,
        closure,
        setClosure,
        publishOrder
    }
}

export default useClosureOrder
