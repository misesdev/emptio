import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import InitializeRoutes from "./login"

type Props = {
    logged: boolean
}

const AppRoutes = ({ logged } : Props) => {
    return (
        <NavigationContainer >            
            {logged && <TabRoutes />}
            {!logged && <InitializeRoutes />}
        </NavigationContainer>
    )
}

export default AppRoutes