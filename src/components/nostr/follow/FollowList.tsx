import { ActivityIndicator, FlatList } from "react-native"
import { userService } from "@/src/core/userManager"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { walletService } from "@src/core/walletManager"
import { FollowItem } from "./FollowItem"
import theme from "@src/theme"
import { NostrEvent } from "@nostr-dev-kit/ndk"

type FriendListProps = {
    iNot?: boolean,
    searchTerm?: string,
    toPayment?: boolean,
    searchable?: boolean,
    onPressFollow?: (user: User) => void,
}

export const FollowList = ({ searchTerm, onPressFollow, toPayment = false, searchable, iNot = true }: FriendListProps) => {

    const { user, followsEvent } = useAuth()
    const searchTimeout:any = useRef(null);
    const [refreshing, setRefreshing] = useState(true)
    const [followList, setFollowList] = useState<User[]>([])
    const [followListData, setFollowListData] = useState<User[]>([])

    useEffect(() => { handleListFollows() }, [])

    if (searchable) {
        useEffect(() => {
            if(searchTimeout.current) clearTimeout(searchTimeout.current)

            searchTimeout.current = setTimeout(() => {
                // search and filter
                if (searchTerm && !walletService.address.validate(searchTerm)) {

                    const searchResult = followListData.filter(follow => {
                        let filterLower = searchTerm.toLowerCase()
                        let filterNameLower = `${follow.name}${follow.display_name}`.toLowerCase()
                        return filterNameLower.includes(filterLower)
                    })

                    setFollowList(searchResult)
                }
                else setFollowList(followListData)
            }, 200)

        }, [searchTerm])
    }

    const handleListFollows = async () => {
        setRefreshing(true)

        var follows = await userService.listFollows(user, followsEvent as NostrEvent, iNot)

        setFollowList(follows)

        setFollowListData(follows)

        setRefreshing(false)
    }

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressFollow)
            onPressFollow(follow)
    }, [onPressFollow])

    const ListItem = memo(({ item }: { item: User }) => <FollowItem follow={item} handleClickFollow={handleClickFollow} />)

    const handleLoaderEnd = () => {
        if (refreshing)
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator color={theme.colors.gray} style={{ margin: 10 }} size={50} />
    }

    return (
        <>
            <FlatList
                data={followList}
                renderItem={({ item }) => <ListItem item={item} />}
                contentContainerStyle={[theme.styles.scroll_container, { paddingBottom: 30 }]}
                ListFooterComponent={handleLoaderEnd}
                keyExtractor={item => item.pubkey ?? Math.random().toString()}
            />
        </>
    )
}
