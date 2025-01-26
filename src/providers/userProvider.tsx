import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"
import { NostrEvent } from "@/src/services/nostr/events";

type AuthContextType = {
    user: User,
    wallets: Wallet[],
    follows?: NostrEvent,
    setUser?: (user: User) => void,
    setWallets?: (wallet: Wallet[]) => void,
    setFollows?: (follows: NostrEvent) => void,
}

const AuthContext = createContext<AuthContextType>({ 
    user: {},
    wallets: [], 
})

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [follows, setFollows] = useState<NostrEvent>()

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            wallets, 
            setWallets,
            follows,
            setFollows,
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

