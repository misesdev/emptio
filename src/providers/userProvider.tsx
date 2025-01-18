import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User, Wallet } from "../services/memory/types"
import { EmptioData } from "../core/emptio";
import { NostrEvent } from "@nostr-dev-kit/ndk";

type AuthContextType = {
    user: User,
    wallets: Wallet[],
    followsEvent?: NostrEvent,
    emptioData: EmptioData,
    setUser?: (user: User) => void,
    setWallets?: (wallet: Wallet[]) => void,
    setFollowsEvent?: (follows: NostrEvent) => void,
    setEmptioData?: (data: EmptioData) => void
}

const AuthContext = createContext<AuthContextType>({ user: {}, wallets: [], emptioData: {} })

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [followsEvent, setFollowsEvent] = useState<NostrEvent>()
    const [emptioData, setEmptioData] = useState<EmptioData>({})

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            wallets, 
            setWallets,
            followsEvent,
            setFollowsEvent,
            emptioData, 
            setEmptioData 
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

