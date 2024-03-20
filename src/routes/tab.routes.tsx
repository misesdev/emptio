import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from "../screens/home/Home"
import Feed from "../screens/home/Feed"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="home">  
            <Tab.Screen name='home' component={Home}/>
            <Tab.Screen name='feed' component={Feed}/>
        </Tab.Navigator>
    )
}

export default TabRoutes