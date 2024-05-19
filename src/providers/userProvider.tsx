import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"
import { EmptioData } from "../core/emptio";

type AuthContextType = {
    user: User,
    wallet: Wallet,
    wallets: Wallet[],
    emptioData: EmptioData,
    setUser?: (user: User) => void,
    setWallet?: (wallet: Wallet) => void,
    setWallets?: (wallets: Wallet[]) => void,
    setEmptioData?: (data: EmptioData) => void
}

const AuthContext = createContext<AuthContextType>({ user: {}, wallet: {}, wallets: [], emptioData: {} })

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallet, setWallet] = useState<Wallet>({})
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [emptioData, setEmptioData] = useState<EmptioData>({})

    return (
        <AuthContext.Provider value={{ user, setUser, wallet, setWallet, wallets, setWallets, emptioData, setEmptioData }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

