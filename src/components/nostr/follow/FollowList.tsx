import { FlatList } from "react-native"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { walletService } from "@src/core/walletManager"
import { FollowItem } from "./FollowItem"
import theme from "@src/theme"
import { getUserName } from "@/src/utils"

type FriendListProps = {
    searchTerm?: string,
    toPayment?: boolean,
    searchable?: boolean,
    searchTimout?: number,
    onPressFollow?: (user: User) => void,
}

export const FollowList = ({ searchTerm, onPressFollow, toPayment = false, 
    searchable, searchTimout = 100 }: FriendListProps) => {

    const { follows } = useAuth()
    const listRef = useRef<FlatList>(null)
    const searchTimeout:any = useRef(null)
    const [followList, setFollowList] = useState<User[]>(follows??[])

    if (searchable) {
        useEffect(() => {
            clearTimeout(searchTimeout.current)
            searchTimeout.current = setTimeout(() => {
                const filter = searchTerm?.trim()
                if (filter?.length && !walletService.address.validate(filter)) {
                    const searchResult = follows?.filter(follow => {
                        let filterNameLower = `${getUserName(follow, 30)}`.toLowerCase()
                        return filterNameLower.includes(filter.toLowerCase())
                    })

                    setFollowList(searchResult ?? [])
                    listRef.current?.scrollToIndex({
                        animated: true,
                        index: 0
                    })
                }
                else setFollowList(follows??[])
            }, searchTimout)

        }, [searchTerm])
    }
   
    // useEffect(() => { handleListFollows() }, [])

    // const handleListFollows = async () => {
    //     if(follows?.length) { 
    //         setFollowListData(follows)
    //         setFollowList(follows)
    //         setRefreshing(false)
    //     } 
    // }

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressFollow)
            onPressFollow(follow)
    }, [onPressFollow])

    const ListItem = memo(({ item }: { item: User }) => <FollowItem follow={item} handleClickFollow={handleClickFollow} />)

    const renderItem = useCallback(({ item }: { item: User }) => {
        return <ListItem item={item} />
    }, [])

    return (
        <FlatList ref={listRef}
            data={followList}
            renderItem={renderItem}
            contentContainerStyle={[theme.styles.scroll_container, { paddingBottom: 30 }]}
            keyExtractor={item => item.pubkey ?? Math.random().toString()}
            /* refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleListFollows} />} */
        />
    )
}


