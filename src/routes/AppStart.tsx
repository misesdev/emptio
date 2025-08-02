import { ServiceProvider } from "../context/ServiceContext"
import { useData } from "../context/UserContext"

const AppScreens = () => {
    const { user } = useData()

    return (
        <ServiceProvider user={user}>
            <></>
        </ServiceProvider>
    )
}

export default AppScreens
