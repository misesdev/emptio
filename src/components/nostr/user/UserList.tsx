import { FlatList, Text } from "react-native"
import { User } from "@services/memory/types"
import { FollowItem } from "../follow/FollowItem"
import { useTranslateService } from "@src/providers/translateProvider"
import { useCallback } from "react"
import theme from "@src/theme"
import { RefreshControl } from "react-native-gesture-handler"

type FriendListProps = {
    users: User[],
    setUsers: (user: User[]) => void,
    toOpen?: boolean,
    toPayment?: boolean,
    toFollow?: boolean,
    refreshing: boolean,
    showEmptyMessage?: boolean,
    onPressUser?: (user: User) => void,
}

export const UserList = ({ users, setUsers, onPressUser, toPayment=false, toOpen=false, 
    toFollow=false, showEmptyMessage=false, refreshing }: FriendListProps) => {

    const { useTranslate } = useTranslateService()

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressUser) onPressUser(follow)
    }, [onPressUser])

    const ListItem = useCallback(({ item }: { item: User }) => {
        return <FollowItem toOpen={toOpen}
            follow={item} toFollow={toFollow} isFriend={item.friend ?? false}
            handleClickFollow={handleClickFollow} 
        />
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
            refreshControl={<RefreshControl refreshing={refreshing}/>}
        />
    )
}
