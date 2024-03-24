import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"

const AppRoutes = () => {
    return (
        <NavigationContainer >            
            <TabRoutes />
        </NavigationContainer>
    )
}

export default AppRoutes