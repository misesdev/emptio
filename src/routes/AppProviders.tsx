import { ReactNode } from "react"
import { AccountProvider } from "../context/AccountContext"
import { ServiceProvider } from "../providers/ServiceProvider"

const AppProviders = ({ children }: { children: ReactNode }) => (
    <AccountProvider>
        <ServiceProvider>
            {children}
        </ServiceProvider>
    </AccountProvider>
)

export default AppProviders
