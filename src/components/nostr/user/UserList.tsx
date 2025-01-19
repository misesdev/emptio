import { FlatList } from "react-native"
import { User } from "@src/services/memory/types"
import { useCallback, useEffect } from "react"
import { FollowItem } from "../follow/FollowItem"
import theme from "@src/theme"
import { useAuth } from "@/src/providers/userProvider"

type FriendListProps = {
    users: User[],
    setUsers: (user: User[]) => void,
    toPayment?: boolean,
    toFollow?: boolean,
    reload: boolean,
    onPressUser?: (user: User) => void,
}

export const UserList = ({ users, setUsers, onPressUser, toPayment = false, toFollow = false, reload }: FriendListProps) => {

    const { followsEvent } = useAuth()

    // useEffect(() => {
    //     users.forEach(u => {
    //         const tags = followsEvent?.tags.filter(t => t[0] == "p" && t[1] == u.pubkey)
    //         u.friend = !!tags?.length
    //     })
    //     setUsers(users)
    // }, [reload])

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressUser) onPressUser(follow)
    }, [onPressUser])

    const handleRenderItem = ({ item }: { item: User }) => {
        const tags = followsEvent?.tags.filter(t => t[0] == "p" && t[1] == item.pubkey)
        return <FollowItem 
            key={item.pubkey?.substring(0, 20)} 
            follow={item} toFollow={toFollow} isFriend={!!tags?.length}
            handleClickFollow={handleClickFollow} 
        />
    }

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
