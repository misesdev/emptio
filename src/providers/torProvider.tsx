import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Tor from 'react-native-tor';
import SplashScreen from '../components/general/SplashScreen';

// Definir a interface para o estado do Tor
interface TorContextProps {
    tor: any
}

// Criar o contexto com valores iniciais
const TorContext = createContext<TorContextProps>({ tor: Tor() });

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

    const [loading, setLoading] = useState(true)
    const [tor, setTor] = useState<any | null>(null)

    useEffect(() => {
        const initializeTor = async () => {
            try {
                const torInstance = Tor({ os: "android" })
                await torInstance.startIfNotStarted()
                setTor(torInstance)
                setLoading(false)
                console.log('Conectado à rede Tor')
            } catch (err) {
                setLoading(false)
                console.error('Erro ao conectar ao Tor', err)
            }
        }

        initializeTor()

        // Parar o Tor quando o componente for desmontado
        return () => {
            if (tor)
            {
                tor.stopIfRunning();
                console.log('Tor parado');
            }
        }
    }, [])

    if(loading)
        return <SplashScreen message='connecting tor...'/>

    return (
        <TorContext.Provider value={{ tor }}>
            {children}
        </TorContext.Provider>
    );
};

