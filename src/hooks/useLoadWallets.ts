import { useEffect, useMemo, useState } from "react"
import { WalletStorage } from "@storage/wallets/WalletStorage"
import { Wallet } from "@services/wallet/types/Wallet"
import { StoredItem } from "@storage/types"

const useLoadWallets = () => {

    const storage = useMemo(() => new WalletStorage(), [])
    const [wallets, setWallets] = useState<StoredItem<Wallet>[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        const load = async () => await loadWallets()
        load()
    }, [])

    const loadWallets = async () => {
        const wallets = await storage.list()
        if(wallets)
            setWallets(wallets)
        setLoading(false)
    }

    return {
        wallets,
        setWallets,
        loading
    }
}

export default useLoadWallets
