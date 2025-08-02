import { createContext, useContext, useState, useEffect, ReactNode,
    ReactElement } from 'react';
import AuthService from '@services/auth/AuthService';

type AuthContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('AuthProvider not found');
    return context;
}

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
    
    const _service = new AuthService()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        _service.isLogged().then(result => {
            setIsLoggedIn(result.success)
        })
    }, []);

    const login = () => setIsLoggedIn(true)
    const logout = () => setIsLoggedIn(false)

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }
