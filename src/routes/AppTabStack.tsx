import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from "react-native-vector-icons/Ionicons"
import HomeScreen from "@screens/root/home"
import FeedOrdersScreen from "@screens/root/orders"
import ChatsScreen from '@screens/root/chats'
import { useTranslateService } from '../providers/translateProvider'
import VideosFeed from '@screens/root/videos'
import { tabBarStyle } from '../constants/RouteSettings'
import theme from "@src/theme"
import useChatStore from '../services/zustand/useChatStore'

const Tab = createBottomTabNavigator()

const AppTabStack = () => {

    const { useTranslate } = useTranslateService()
    const unreadChats = useChatStore((state) => state.unreadChats)

    return (
        <Tab.Navigator
            initialRouteName="home"
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
                name="home"
                component={HomeScreen}                
                options={{                    
                    tabBarLabel: useTranslate("menu.wallet"),
                    tabBarIcon: ({ color }) => <Ionicons name="briefcase" color={color} size={theme.icons.medium} />,
                    //tabBarBadge: 1
                }}
            />
            <Tab.Screen
                name="orders"
                component={FeedOrdersScreen}
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

