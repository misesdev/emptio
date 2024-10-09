import { FlatList } from "react-native"
import { User } from "@src/services/memory/types"
import { useCallback } from "react"
import { FollowItem } from "../follow/FollowItem"
import theme from "@src/theme"

type FriendListProps = {
    users: User[],
    toPayment?: boolean,
    onPressUser?: (user: User) => void,
}

export const UserList = ({ users, onPressUser, toPayment = false }: FriendListProps) => {

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressUser) onPressUser(follow)
    }, [onPressUser])

    const handleRenderItem = ({ item }: { item: User }) => <FollowItem follow={item} handleClickFollow={handleClickFollow} />

    return (
        <>
            <FlatList
                data={users}
                renderItem={handleRenderItem}
                contentContainerStyle={theme.styles.scroll_container}
                keyExtractor={item => item.pubkey ?? Math.random().toString()}
            />
        </>
    )
}
