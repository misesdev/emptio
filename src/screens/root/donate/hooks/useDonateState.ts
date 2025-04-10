import { useAuth } from "@src/providers/userProvider"
import { userService } from "@services/user"
import { User, Wallet } from "@services/memory/types"
import { useEffect, useState } from "react"

export const useDonateState = ({ navigation, route }: any) => {
   
    const { wallets } = useAuth()
    const [amount, setAmount] = useState<string>("0")
    const [disabled, setDisabled] = useState(true)
    const [receiver, setReceiver] = useState<User>({})
    const [wallet, setWallet] = useState<Wallet>(route?.params?.wallet as Wallet)

    useEffect(() => {
        let pubkey: string = process.env.EMPTIO_PUBKEY ?? ""
        userService.getProfile(pubkey.trim()).then(receiver => {
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
