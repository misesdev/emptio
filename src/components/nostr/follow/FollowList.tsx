import { ActivityIndicator, FlatList } from "react-native"
import { userService } from "@src/core/userManager"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { walletService } from "@src/core/walletManager"
import { FollowItem } from "./FollowItem"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import theme from "@src/theme"
import { RefreshControl } from "react-native-gesture-handler"

type FriendListProps = {
    iNot?: boolean,
    searchTerm?: string,
    toPayment?: boolean,
    searchable?: boolean,
    searchTimout?: number,
    onPressFollow?: (user: User) => void,
}

export const FollowList = ({ searchTerm, onPressFollow, toPayment = false, 
    searchable, iNot = true, searchTimout = 100 }: FriendListProps) => {

    const { user, follows } = useAuth()
    const searchTimeout:any = useRef(null);
    const [refreshing, setRefreshing] = useState(true)
    const [followList, setFollowList] = useState<User[]>([])
    const [followListData, setFollowListData] = useState<User[]>([])

    if (searchable) {
        useEffect(() => {
            clearTimeout(searchTimeout.current)
            searchTimeout.current = setTimeout(() => {
                const filter = searchTerm?.trim()
                if (filter?.length && !walletService.address.validate(filter)) {
                    const searchResult = followListData.filter(follow => {
                        let filterNameLower = `${follow.name}${follow.display_name}`.toLowerCase()
                        return filterNameLower.includes(filter.toLowerCase())
                    })

                    setFollowList(searchResult)
                }
                else setFollowList(followListData)
            }, searchTimout)

        }, [searchTerm])
    }
   
    useEffect(() => { handleListFollows() }, [])

    const handleListFollows = async () => {
        userService.listFollows(user, follows as NostrEvent, iNot).then(followList => {
            setFollowListData(followList)
            setFollowList(followList) 
            setRefreshing(false)
        })
        .catch(() => setRefreshing(false))
    }

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressFollow)
            onPressFollow(follow)
    }, [onPressFollow])

    const ListItem = memo(({ item }: { item: User }) => <FollowItem follow={item} handleClickFollow={handleClickFollow} />)

    const renderItem = useCallback(({ item }: { item: User }) => {
        return <ListItem item={item} />
    }, [])

    return (
        <>
            <FlatList
                data={followList}
                renderItem={renderItem}
                contentContainerStyle={[theme.styles.scroll_container, { paddingBottom: 30 }]}
                keyExtractor={item => item.pubkey ?? Math.random().toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleListFollows} />}
            />
        </>
    )
}


