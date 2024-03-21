import { createDrawerNavigator } from "@react-navigation/drawer";

import TabRoutes from "./tab.routes";
import theme from "../theme";
import { StyleSheet } from "react-native";

const Drawer = createDrawerNavigator()

const DrawerRoutes = () => {
    return (
        <Drawer.Navigator 
            screenOptions={{ 
                headerTitle: '',
                headerTransparent: true,
                drawerStyle: styles.drawer,                 
                sceneContainerStyle: styles.tabBottom,  
                headerLeft: () => <></>
            }} >  
            <Drawer.Screen
                name='menu'
                component={TabRoutes}
            />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    drawer: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: theme.COLORS.BLACK
    },
    header: {
        backgroundColor: theme.COLORS.TRANSPARENT
    },
    tabBottom: {
        backgroundColor: theme.COLORS.TRANSPARENT
    }
})

export default DrawerRoutes