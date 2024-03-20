import { NavigationContainer } from "@react-navigation/native"

import TabRoutes from "./tab.routes"
import StackRoutes from "./stack.routes"
import DrawerRoutes from "./drawer.routes"

const AppRoutes = () => {

    return (
        <NavigationContainer >            
            {/* <TabRoutes /> */}
            <DrawerRoutes />
            {/* <StackRoutes /> */}
        </NavigationContainer>
    )
}

export default AppRoutes