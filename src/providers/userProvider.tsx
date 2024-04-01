import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"

type AuthContextType = {
    user?: User,
    wallets?: Wallet[]
    setUser?: (user: User) => void
    setWallets?: (wallets: Wallet[]) => void
}

const AuthContext = createContext<AuthContextType>({ })

const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext)
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallets, setWallets] = useState<Wallet[]>([])

    return (
        <AuthContext.Provider value={{ user, setUser, wallets, setWallets }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

