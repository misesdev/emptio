import { createContext, useContext, useState, useEffect, 
    ReactNode, ReactElement } from 'react';
import { User } from '@services/user/types/User';
import { Wallet } from '@services/wallet/types/Wallet';
import { WalletStorage } from '@storage/wallets/WalletStorage';
import { StoredItem } from '@storage/types';
import UserService from '@services/user/UserService';
import { AppSettings } from '@storage/settings/types';
import { AppSettingsStorage } from '@storage/settings/AppSettingsStorage';
import { NostrEvent } from '@nostr-dev-kit/ndk-mobile';

type UserContextType = {
    user: User;
    setUser: (u: User) => void;
    settings: AppSettings;
    setSettings: (s: AppSettings) => void;
    wallets: StoredItem<Wallet>[];
    setWallets: (ws: StoredItem<Wallet>[]) => void;
    follows: User[];
    setFollows: (fs: User[]) => void;
    followsEvent: NostrEvent;
    setFollowsEvent: (e: NostrEvent) => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const useData = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('AuthProvider not found');
    return context;
}

const UserProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const _service = new UserService()
    const _wallets = new WalletStorage()
    const _settings = new AppSettingsStorage()
    const [user, setUser] = useState<User>({} as User)
    const [wallets, setWallets] = useState<StoredItem<Wallet>[]>([])
    const [settings, setSettings] = useState<AppSettings>({} as AppSettings)
    const [follows, setFollows] = useState<User[]>([])
    const [followsEvent, setFollowsEvent] = useState<NostrEvent>({} as NostrEvent)

    useEffect(() => { loadData() }, []);
    useEffect(() => { 
        if(user.pubkey && followsEvent.pubkey) loadFollowers() 
    }, [followsEvent]);

    const loadData = async () => {
        await _service.init()
        const user = await _service.getProfile()
        const wallets = await _wallets.list()
        const settings = await _settings.get()
        setUser(user)
        setWallets(wallets)
        setSettings(settings)
    }

    const loadFollowers = async () => {
        const follows = await _service.listFollows({
            follows: followsEvent, iNot: true
        })
        setFollows(follows)
    } 

    return (
        <UserContext.Provider value={{ 
                user, 
                setUser,
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

export { UserProvider, useData }
