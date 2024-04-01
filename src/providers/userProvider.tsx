import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { User } from "../services/memory/types"

type AuthContextType = {
    user?: User,
    setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({ setUser: () => { } })

const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext)
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [user, setUser] = useState<User>()

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, useAuth }

