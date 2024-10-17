import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Tor from 'react-native-tor';

// Definir a interface para o estado do Tor
interface TorContextProps {
    tor: any | null;
    isConnected: boolean;
    error: string | null;
    makeGetRequest?: (url: string) => Promise<any>;
}

// Criar o contexto com valores iniciais
const TorContext = createContext<TorContextProps>({
    tor: null,
    isConnected: false,
    error: null,
});

// Hook para facilitar o uso do contexto em outros componentes
export const useTor = (): TorContextProps => {
    return useContext(TorContext);
};

// Props esperadas pelo TorProvider (neste caso, os componentes filhos)
interface TorProviderProps {
    children: ReactNode;
}

// Criar o Provider do Tor
export const TorProvider = ({ children }: TorProviderProps) => {
    const [tor, setTor] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeTor = async () => {
            try {
                const torInstance = Tor();
                await torInstance.startIfNotStarted();
                setTor(torInstance);
                setIsConnected(true);
                console.log('Conectado à rede Tor');
            } catch (err: any) {
                setError(err.message || 'Erro ao conectar ao Tor');
                console.error('Erro ao conectar ao Tor', err);
            }
        };

        initializeTor();

        // Parar o Tor quando o componente for desmontado
        return () => {
            if (tor) {
                tor.stop();
                console.log('Tor parado');
            }
        };
    }, []);

    // Função para fazer uma requisição GET via Tor
    const makeGetRequest = async (url: string): Promise<any> => {
        if (isConnected && tor) {
            try {
                const response = await tor.get(url);
                return response.data;
            } catch (err: any) {
                console.error('Erro na requisição via Tor:', err);
                throw err;
            }
        } else {
            throw new Error('Tor não está conectado');
        }
    };

    return (
        <TorContext.Provider value={{ tor, isConnected, error, makeGetRequest }}>
            {children}
        </TorContext.Provider>
    );
};

