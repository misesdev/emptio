import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslateService } from '../providers/TranslateProvider'
import Ionicons from "react-native-vector-icons/Ionicons"
import HomeScreen from "@screens/root/home/HomeScreen"
import OrdersScreen from "@screens/root/orders/OrdersScreen"
import ChatsScreen from '@screens/root/chats/ChatsScreen'
import VideosFeed from '@screens/root/videos/FeedVideosScreen'
import { tabBarStyle } from '../constants/RouteSettings'
import useChatStore from '@services/zustand/useChatStore'
import theme from "@src/theme"

const Tab = createBottomTabNavigator()

const AppTabStack = () => {

    const { useTranslate } = useTranslateService()
    const unreadChats = useChatStore((state) => state.unreadChats)

    return (
        <Tab.Navigator
            initialRouteName="wallet"
            screenOptions={{
                tabBarActiveTintColor: theme.colors.blue,
                tabBarInactiveTintColor: theme.colors.gray,
                tabBarStyle: tabBarStyle,
                headerStyle: { backgroundColor: theme.colors.black },
                tabBarHideOnKeyboard: true,
                headerTitle: ""
            }}
        >
            <Tab.Screen
                name="wallet"
                component={HomeScreen}                
                options={{                    
                    tabBarLabel: useTranslate("menu.wallet"),
                    tabBarIcon: ({ color }) => <Ionicons name="briefcase" color={color} size={theme.icons.medium} />,
                    //tabBarBadge: 1
                }}
            />
            <Tab.Screen
                name="orders"
                component={OrdersScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: useTranslate("menu.orders"),
                    tabBarIcon: ({ color }) => <Ionicons name="trail-sign" color={color} size={theme.icons.large} />,
                    // tabBarBadge: false
                }}
            />
            {/* <Tab.Screen */}
            {/*     name="videos-feed" */}
            {/*     component={VideosFeed} */}
            {/*     options={{ */}
            {/*         headerShown: false, */}
            {/*         tabBarLabel: useTranslate("menu.videos"), */}
            {/*         tabBarIcon: ({ color }) => <Ionicons name="caret-forward-circle" color={color} size={theme.icons.large} />, */}
            {/*         // tabBarBadge: false */}
            {/*     }} */}
            {/* /> */}
            <Tab.Screen
                name="chats"
                component={ChatsScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: useTranslate("menu.chats"),
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" color={color} size={theme.icons.medium} />,
                    tabBarBadge: !!unreadChats.length ? unreadChats.length : undefined,
                }}
            />
        </Tab.Navigator>
    )
}

export default AppTabStack

