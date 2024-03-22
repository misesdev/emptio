import { createStackNavigator } from "@react-navigation/stack";

import FeedSearch from "@screens/initial/feed/search/FeedSearch";
import theme from "@src/theme";
import Feed from "@screens/initial/feed";
import { stackOptions } from "@src/constants/RouteSettings";
import UserMenu from "@src/screens/menu";

const Stack = createStackNavigator()

const StackFeed = () => {
    return (
        <Stack.Navigator screenOptions={stackOptions} initialRouteName="feed-stack">
            <Stack.Screen name="feed-stack" component={Feed} />
            <Stack.Screen name="search-feed"
                component={FeedSearch}
                options={{
                    title: "",
                    headerTintColor: theme.colors.gray
                }}
            />
            <Stack.Screen name="menu-feed"
                component={UserMenu}
                options={{
                    title: "",
                    headerTintColor: theme.colors.gray
                }}
            />
        </Stack.Navigator>
    )
}

export default StackFeed