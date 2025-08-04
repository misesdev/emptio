import { createContext, useContext, ReactNode, ReactElement } from 'react';
import AuthService from '@services/auth/AuthService';
import UserService from '@services/user/UserService';
import WalletService from '@services/wallet/WalletService';
import WalletFactory from '@services/wallet/WalletFactory';
import MessageService from '@services/message/MessageService';
import NoteService from '@services/nostr/note/NoteService';
import RelaysService from '@services/relays/RelaysService';
import { useAuth } from '../context/AuthContext';
import { TranslateService } from '@services/translate/TranslateService';
import BlobService from '@services/blob/BlobService';

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

    const { user } = useAuth()
    const authService = new AuthService()
    const userService = new UserService(user)
    const walletService = new WalletService()
    const walletFactory = new WalletFactory()
    const messageService = new MessageService(user)
    const noteService = new NoteService(user)
    const relayService = new RelaysService()
    const translateService = new TranslateService()
    const blobService = new BlobService(user)

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
            }}
        >
            {children}
        </ServiceContext.Provider>
    )
}

export { ServiceProvider, useService }
