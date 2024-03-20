import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import StackRoutes from "./stack.routes"

const AppRoutes = () => {

    return (
        <NavigationContainer >            
            <TabRoutes />
            {/* <StackRoutes /> */}
        </NavigationContainer>
    )
}

export default AppRoutes