import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "@screens/root/home"
import FeedScreen from "@screens/root/feed"
import theme from "@src/theme"
import ChatsScreen from '@screens/root/chats';
import NotificationScreen from '@screens/root/notifications';
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
            barStyle={{ backgroundColor: theme.colors.black }}
            activeIndicatorStyle={{ backgroundColor: theme.colors.blue }}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    tabBarLabel: useTranslate("menu.home"),
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="feed"
                component={FeedScreen}
                options={{
                    tabBarLabel: useTranslate("menu.orders"),
                    tabBarIcon: ({ color }) => <Ionicons name="storefront" color={color} size={theme.icons.medium} />,
                }}
            />
            <Tab.Screen
                name="chats"
                component={ChatsScreen}
                options={{
                    tabBarLabel: useTranslate("menu.chats"),
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" color={color} size={theme.icons.medium} />,
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

