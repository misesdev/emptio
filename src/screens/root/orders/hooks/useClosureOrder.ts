import { useAccount } from "@/src/context/AccountContext"
import { Formatter } from "@/src/services/converter/Formatter"
import { TimeSeconds } from "@/src/services/converter/TimeSeconds"
import { Order } from "@/src/services/order/Order"
import { useState } from "react"

const useClosureOrder = ({ navigation, route }: any) => {

    const { user } = useAccount() 
    const { satoshis, wallet, price, currency } = route.params
    const [closure, _setClosure] = useState<number>(TimeSeconds.now())
    const [loading, setLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const setClosure = (value: number) => {
        _setClosure(Math.floor(value/1000))
        setDisabled(value <= TimeSeconds.now())
    }

    const publishOrder = async () => {
        setLoading(true)
        setDisabled(true)

        // pulish order implemenmtation
        const order = new Order(user, {
            price: Formatter.textToNumber(price),
            amount: Formatter.textToNumber(satoshis),
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
