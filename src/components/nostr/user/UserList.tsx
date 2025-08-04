import { useTranslateService } from "@/src/providers/TranslateProvider";
import { FlatList, Text } from "react-native"
import { FollowItem } from "../follow/FollowItem"
import { useCallback } from "react"
import { User } from "@services/user/types/User";
import theme from "@src/theme"

interface FriendListProps {
    users: User[];
    showButton?: boolean;
    labelAction?: string;
    onPressUser?: (user: User) => void;
}

export const UserList = ({ 
    users, onPressUser, showButton=false, labelAction
}: FriendListProps) => {

    const { useTranslate } = useTranslateService()

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressUser) onPressUser(follow)
    }, [onPressUser])

    const ListItem = useCallback(({ item }: { item: User }) => {
        return (
            <FollowItem 
                showButton={showButton}
                labelAction={labelAction}
                handleClickFollow={handleClickFollow} 
                follow={item}
            />
        )
    },[])

    const EmptyComponent = () => (
        <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
            {useTranslate("friends.search.subtitle")}
        </Text>
    )

    return (
        <FlatList
            data={users}
            ListEmptyComponent={EmptyComponent}
            renderItem={({ item }) => <ListItem item={item} />}
            contentContainerStyle={theme.styles.scroll_container}
            keyExtractor={item => item.pubkey ?? Math.random().toString()}
        />
    )
}
