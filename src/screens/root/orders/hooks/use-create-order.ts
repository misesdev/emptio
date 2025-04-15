import { useAuth } from "@src/providers/userProvider"
import { timeSeconds, toNumber } from "@services/converter"
import { useState } from "react"
import { Order } from "@services/nostr/orders"

const useCreateOrder = ({ navigation, route }: any) => {

    const { user } = useAuth() 
    const { amount, wallet } = route.params
    const [price, setPrice] = useState<string>("0")
    const [currency, setCurrency] = useState<string>("USD")
    const [closure, _setClosure] = useState<number>(timeSeconds.now())
    const [loading, setLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const setClosure = (value: number) => {
        _setClosure(Math.floor(value/1000))
    }

    const publishOrder = async () => {
        setLoading(true)
        setDisabled(true)

        // pulish order implemenmtation
        const order = new Order(user, {
            price: toNumber(price),
            amount: toNumber(amount),
            closure,
            currency
        })

        await order.publish()

        setDisabled(false)
        setLoading(false)
    }

    return {
        loading,
        disabled,
        amount,
        setClosure,
        publishOrder
    }
}

export default useCreateOrder
