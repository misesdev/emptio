import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"

type AuthContextType = {
    user: User,
    wallet: Wallet,
    wallets: Wallet[],
    setUser?: (user: User) => void,
    setWallet?: (wallet: Wallet) => void,
    setWallets?: (wallets: Wallet[]) => void
}

const AuthContext = createContext<AuthContextType>({ user: {}, wallet: {}, wallets: [] })

const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext)

    return context
}

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallet, setWallet] = useState<Wallet>({})
    const [wallets, setWallets] = useState<Wallet[]>([])

    return (
        <AuthContext.Provider value={{ user, setUser, wallet, setWallet, wallets, setWallets }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

