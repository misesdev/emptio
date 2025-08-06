import { useAccount } from "@src/context/AccountContext"
import { Wallet } from "@services/wallet/types/Wallet"
import { Formatter } from "@services/converter/Formatter"
import { useEffect, useState } from "react"

const useNewOrder = ({ navigation }: any) => {
    
    const { wallets, settings } = useAccount()
    const [price, setPrice] = useState<string>("0")
    const [satoshis, setSatoshis] = useState<string>("0")
    const [nextDisabled, setNextDisabled] = useState(true)
    const [wallet, setWallet] = useState<Wallet>({} as Wallet)

    useEffect(() => { 
        setWallet(wallets.find(w => w.entity.default)?.entity ?? {} as Wallet)
        setPrice(Formatter.formatMoney(0, settings.currency?.code))
    }, [wallets, settings])

    const goToClosure = () => {
        navigation.navigate("orders-ndetails", { 
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

