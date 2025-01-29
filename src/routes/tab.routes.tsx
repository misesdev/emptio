import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from "react-native-vector-icons/Ionicons"
import HomeScreen from "@screens/root/home"
import FeedScreen from "@screens/root/orders"
import ChatsScreen from '@screens/root/chats'
import { useTranslateService } from '../providers/translateProvider'
import useChatStore from '../services/zustand/chats'
import theme from "@src/theme"

const Tab = createBottomTabNavigator()

const TabRoutes = () => {

    const { useTranslate } = useTranslateService()
    const unreadChats = useChatStore((state) => state.unreadChats)

    return (
        <Tab.Navigator
            initialRouteName="home"
            //activeColor={theme.colors.white}
            //inactiveColor={theme.colors.gray}
            screenOptions={{ 
                tabBarActiveTintColor: theme.colors.white,
                tabBarInactiveTintColor: theme.colors.gray
            }}
            //barStyle={{ backgroundColor: theme.colors.semitransparent, height: 92 }}
            //activeIndicatorStyle={{ backgroundColor: theme.colors.blue }}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}                
                options={{                    
                    tabBarLabel: useTranslate("menu.home"),
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={theme.icons.medium} />,
                    // tabBarBadge: false
                }}
            />
            <Tab.Screen
                name="feed"
                component={FeedScreen}
                options={{
                    tabBarLabel: useTranslate("menu.orders"),
                    tabBarIcon: ({ color }) => <Ionicons name="briefcase" color={color} size={theme.icons.large} />,
                    // tabBarBadge: false
                }}
            />
            <Tab.Screen
                name="chats"
                component={ChatsScreen}
                options={{
                    tabBarLabel: useTranslate("menu.chats"),
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" color={color} size={theme.icons.medium} />,
                    // tabBarBadge: !!unreadChats.length ? unreadChats.length : false,
                }}
            />

            {/* <Tab.Screen */}
            {/*     name="notifications" */}
            {/*     component={NotificationScreen} */}
            {/*     options={{ */}
            {/*         tabBarLabel: useTranslate("menu.notifications"), */}
            {/*         tabBarIcon: ({ color }) => <Ionicons name="notifications" color={color} size={theme.icons.medium} />, */}
            {/*     }} */}
            {/* /> */}
        </Tab.Navigator>
    )
}

export default TabRoutes

