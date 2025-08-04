import { createContext, useContext, useState, useEffect, 
    ReactNode, ReactElement } from 'react';
import { User } from '@services/user/types/User';
import { Wallet } from '@services/wallet/types/Wallet';
import { StoredItem } from '@storage/types';
import UserService from '@services/user/UserService';
import { AppSettings } from '@storage/settings/types';
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile';
import SplashScreen from '@components/general/SplashScreen';
import useLoadAccount from '../hooks/useLoadAccount';
import { useAuth } from './AuthContext';

type UserContextType = {
    user: User,
    settings: AppSettings;
    setSettings: (s: AppSettings) => void;
    wallets: StoredItem<Wallet>[];
    setWallets: (ws: StoredItem<Wallet>[]) => void;
    follows: User[];
    setFollows: (fs: User[]) => void;
    followsEvent: NDKEvent;
    setFollowsEvent: (e: NDKEvent) => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const useAccount = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('AuthProvider not found');
    return context;
}

type Props = { children: ReactNode; }

const AccountProvider = ({ children }: Props): ReactElement => {

    const { user } = useAuth()
    const [follows, setFollows] = useState<User[]>([])
    const [wallets, setWallets] = useState<StoredItem<Wallet>[]>([])
    const [settings, setSettings] = useState<AppSettings>({} as AppSettings)
    const [followsEvent, setFollowsEvent] = useState<NDKEvent>({} as NDKEvent)
    const [_service, _] = useState(new UserService(user))
    const { loading } = useLoadAccount({ 
        user,
        setSettings,
        setWallets,
        setFollowsEvent 
    })
    
    useEffect(() => {
        _service.setSettings(settings)
    },[settings])

    useEffect(() => { 
        if(user.pubkey && followsEvent.pubkey) loadFollowers() 
    }, [followsEvent]);

    const loadFollowers = async () => {
        const follows = await _service.listFollows({
            follows: followsEvent, iNot: true
        })
        setFollows(follows)
    } 

    if(loading)
        return <SplashScreen message='Loading account' />

    return (
        <UserContext.Provider value={{
                user,
                wallets,
                setWallets,
                settings,
                setSettings,
                follows,
                setFollows,
                followsEvent,
                setFollowsEvent
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export { AccountProvider, useAccount }
