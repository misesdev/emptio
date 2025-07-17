import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User } from "@services/user/types/User";
import { Wallet } from "@storage/wallets/types";
import { NostrEvent } from "@nostr-dev-kit/ndk-mobile";
import UserService from "@services/user/UserService";
import { WalletStorage } from "@storage/wallets/WalletStorage";

interface AuthContextType {
    user?: User;
    follows: User[];
    wallets: Wallet[];
    followsEvent?: NostrEvent;
    setUser?: (user: User) => void;
    setWallets?: (wallet: Wallet[]) => void;
    setFollows?: (follows: User[]) => void;
    setFollowsEvent?: (follows: NostrEvent) => void;
}

const AuthContext = createContext<AuthContextType>({ 
    wallets: [], 
    follows: []
})

const useAuth = (): AuthContextType => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const _service = new UserService()
    const _walletStorage = new WalletStorage()
    const [user, setUser] = useState<User>()
    const [follows, setFollows] = useState<User[]>([])
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [followsEvent, setFollowsEvent] = useState<NostrEvent>()

    useEffect(() => {
        handleUserData()
    }, [])

    const handleUserData = async () => {
        await _service.init()
        const user = await _service.getProfile()
        const wallets = await _walletStorage.listEntities()
        setWallets(wallets)
        setUser(user)
    }

    useEffect(() => {
        if(user?.pubkey) 
        {
            _service.listFollows({ follows: followsEvent }).then(followList => {
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

