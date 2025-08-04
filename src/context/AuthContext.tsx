import { createContext, useContext, useState, useEffect, ReactNode,
    ReactElement } from 'react';
import AuthService from '@services/auth/AuthService';
import SplashScreen from '@components/general/SplashScreen';
import { User } from '@services/user/types/User';

type AuthContextType = {
    user: User;
    isLoggedIn: boolean;
    login: (u: User) => void;
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
    const [loading, setLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User>({} as User)

    useEffect(() => {
        _service.isLogged().then(result => {
            setIsLoggedIn(result.success)
            setLoading(false)
        })
    }, []);

    const login = (user: User) => {
        setIsLoggedIn(true)
        setUser(user)
    }

    const logout = () => setIsLoggedIn(false)

    if(loading) return <SplashScreen />

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }
