import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "@screens/root/home"
import FeedScreen from "@screens/root/feed"
import theme from "@src/theme"
import ChatsScreen from '@screens/root/chats';
import { useTranslateService } from '../providers/translateProvider';

const Tab = createMaterialBottomTabNavigator()

const TabRoutes = () => {

    const { useTranslate } = useTranslateService()

    return (
        <Tab.Navigator
            initialRouteName="home"
            activeColor={theme.colors.white}
            inactiveColor={theme.colors.gray}
            screenOptions={{ tabBarColor: theme.colors.gray }}
            barStyle={{ backgroundColor: theme.colors.semitransparent, height: 80 }}
            activeIndicatorStyle={{ backgroundColor: theme.colors.blue }}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}                
                options={{                    
                    tabBarLabel: "", // useTranslate("menu.home"),
                    tabBarIcon: ({ color }) => <Ionicons name="wallet" color={color} size={theme.icons.medium} />,
                    tabBarBadge: false
                }}
            />
            <Tab.Screen
                name="feed"
                component={FeedScreen}
                options={{
                    tabBarLabel: "", //useTranslate("menu.orders"),
                    tabBarIcon: ({ color }) => <Ionicons name="git-compare" color={color} size={theme.icons.large} />,
                    tabBarBadge: false
                }}
            />
            <Tab.Screen
                name="chats"
                component={ChatsScreen}
                options={{
                    tabBarLabel: "",// useTranslate("menu.chats"),
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" color={color} size={theme.icons.medium} />,
                    tabBarBadge: false
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

