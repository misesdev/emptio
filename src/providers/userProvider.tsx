import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"
import { EmptioData } from "../core/emptio";

type AuthContextType = {
    user: User,
    wallets: Wallet[],
    emptioData: EmptioData,
    setUser?: (user: User) => void,
    setWallets?: (wallet: Wallet[]) => void,
    setEmptioData?: (data: EmptioData) => void
}

const AuthContext = createContext<AuthContextType>({ user: {}, wallets: [], emptioData: {} })

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [emptioData, setEmptioData] = useState<EmptioData>({})

    return (
        <AuthContext.Provider value={{ user, setUser, wallets, setWallets, emptioData, setEmptioData }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

