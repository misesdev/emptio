import { createContext, useContext, ReactNode, ReactElement, useMemo, useEffect } from 'react';
import AuthService from '@services/auth/AuthService';
import UserService from '@services/user/UserService';
import WalletService from '@services/wallet/WalletService';
import WalletFactory from '@services/wallet/WalletFactory';
import MessageService from '@services/message/MessageService';
import NoteService from '@services/nostr/note/NoteService';
import RelaysService from '@services/relays/RelaysService';
import { TranslateService } from '@services/translate/TranslateService';
import BlobService from '@services/blob/BlobService';
import { useAccount } from '../context/AccountContext';

type ServiceContextType = {
    authService: AuthService;
    userService: UserService;
    walletService: WalletService;
    walletFactory: WalletFactory;
    messageService: MessageService;
    noteService: NoteService;
    relayService: RelaysService;
    translateService: TranslateService;
    blobService: BlobService;
}

const ServiceContext = createContext<ServiceContextType>({} as ServiceContextType);

const useService = (): ServiceContextType => {
    const context = useContext(ServiceContext);
    if (!context) throw new Error('ServiceProvider not found');
    return context;
}

type Props = { children: ReactNode; }

const ServiceProvider = ({ children }: Props): ReactElement => {

    const { user, settings } = useAccount()
    const authService = useMemo(() => new AuthService(), [])
    const userService = useMemo(() => new UserService(user), [user])
    const walletService = useMemo(() => new WalletService(), [])
    const walletFactory = useMemo(() => new WalletFactory(), [])
    const messageService = useMemo(() => new MessageService(user), [user])
    const noteService = useMemo(() => new NoteService(user), [user])
    const relayService = useMemo(() => new RelaysService(), [])
    const translateService = useMemo(() => new TranslateService(), [])
    const blobService = useMemo(() => 
        new BlobService(user, settings.uploadServer)
    , [user, settings])

    useEffect(() => {
        const start = async () => initServices()
        start()
    }, [settings])

    const initServices = async () => {
        await translateService.init()
    }

    return (
        <ServiceContext.Provider value={{ 
            authService, 
            userService, 
            walletService,
            walletFactory,
            messageService,
            noteService,
            relayService,
            translateService,
            blobService
        }}>
            {children}
        </ServiceContext.Provider>
    )
}

export { ServiceProvider, useService }
