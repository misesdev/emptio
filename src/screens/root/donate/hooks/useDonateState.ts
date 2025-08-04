import { useAccount } from "@src/context/AccountContext"
import { useService } from "@src/providers/ServiceProvider"
import { User } from "@services/user/types/User"
import { Wallet } from "@services/wallet/types/Wallet"
import { useEffect, useState } from "react"

export const useDonateState = ({ navigation, route }: any) => {
   
    const { wallets } = useAccount()
    const { userService } = useService()
    const [amount, setAmount] = useState<string>("0")
    const [disabled, setDisabled] = useState(true)
    const [receiver, setReceiver] = useState<User>({} as User)
    const [wallet, setWallet] = useState<Wallet>(route?.params?.wallet as Wallet)

    useEffect(() => {
        let pubkey: string = process.env.EMPTIO_PUBKEY ?? ""
        userService.getUser(pubkey.trim()).then(receiver => {
            setReceiver(receiver)
        }).catch(console.log)
    }, [])

    const sendMoney = () => {
        const address = wallet.network == "testnet" ? process.env.EMPTIO_TESTNET_ADDRESS
            : process.env.EMPTIO_MAINNET_ADDRESS

        navigation.navigate("wallet-send-final-stack", { 
            origin: "donation",
            receiver,
            wallet,
            amount,
            address
        })
    }

    return {
        wallets,
        amount,
        setAmount,
        wallet,
        setWallet,
        disabled,
        setDisabled,
        sendMoney
    }
}
