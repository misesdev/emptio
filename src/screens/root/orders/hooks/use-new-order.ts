import { useSettings } from "@src/providers/settingsProvider"
import { useAuth } from "@src/providers/userProvider"
import { useEffect, useState } from "react"
import { Wallet } from "@services/memory/types"
import { formatCurrency } from "@services/converter/currency"

const useNewOrder = ({ navigation }: any) => {
    
    const { wallets } = useAuth()
    const { settings } = useSettings()
    const [price, setPrice] = useState<string>("0")
    const [satoshis, setSatoshis] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)
    const [wallet, setWallet] = useState<Wallet>({})

    useEffect(() => { 
        setWallet(wallets.find(w => w.default) ?? {})
        setPrice(formatCurrency(0, settings.currency?.code))
    }, [])

    const goToClosure = () => {
        navigation.navigate("feed-order-ndetails", { 
            currency: settings.currency?.code,
            satoshis,
            wallet, 
            price,
        })
    }
    return {
        wallet,
        setWallet,
        wallets,
        price,
        setPrice,
        satoshis,
        setSatoshis,
        nextDisabled,
        setNextDisabled,
        goToClosure
    }
}

export default useNewOrder

