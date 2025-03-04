import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User, Wallet } from "@services/memory/types"
import { NostrEvent } from "@services/nostr/events";
import { userService } from "@services/user";
import { walletService } from "@services/wallet";

type AuthContextType = {
    user: User,
    wallets: Wallet[],
    follows: User[],
    followsEvent?: NostrEvent,
    setUser?: (user: User) => void,
    setWallets?: (wallet: Wallet[]) => void,
    setFollows?: (follows: User[]) => void,
    setFollowsEvent?: (follows: NostrEvent) => void,
}

const AuthContext = createContext<AuthContextType>({ 
    user: {},
    wallets: [], 
    follows: []
})

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>({})
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [follows, setFollows] = useState<User[]>([])
    const [followsEvent, setFollowsEvent] = useState<NostrEvent>()

    useEffect(() => {
        walletService.list().then(setWallets)
        userService.getUser().then(setUser)
    }, [])

    useEffect(() => {
        if(user.pubkey) 
        {
            userService.listFollows(user, followsEvent as NostrEvent,true)
                .then(followList => {
                setFollows(followList)
            })
        }
    }, [followsEvent])

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            wallets, 
            setWallets,
            follows,
            setFollows,
            followsEvent,
            setFollowsEvent,
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

