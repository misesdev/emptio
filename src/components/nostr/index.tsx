import { ActivityIndicator, FlatList, View } from "react-native"
import { userService } from "@services/user"
import { useTranslate } from "@services/translate"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { useCallback, useEffect, useState } from "react"
import { walletService } from "@services/wallet"
import { SectionHeader } from "../general/section/headers"
import { FollowItem } from "./follow/FollowItem"
import theme from "@src/theme"

interface FriendListProps {
    searchTerm?: string,
    loadCombo?: number,
    toFollow?: boolean,
    toPayment?: boolean,
    searchable?: boolean,
    onPressFollow?: (user: User) => void,
}

export const FriendList = ({ searchTerm, onPressFollow, loadCombo=20, 
    toFollow=false, toPayment=false, searchable }: FriendListProps) => {

    const { user, followsEvent } = useAuth()
    const [listCounter, setListCounter] = useState(loadCombo)
    const [refreshing, setRefreshing] = useState(true)
    const [followList, setFollowList] = useState<User[]>([])
    const [labelFriends, setLabelFriends] = useState<string>("")
    const [followListData, setFollowListData] = useState<User[]>([])

    useEffect(() => {
        handleListFollows() 
        useTranslate("labels.friends").then(setLabelFriends)
    }, [])

    if (searchable) {
        useEffect(() => {
            // search and filter
            if (searchTerm && !walletService.address.validate(searchTerm)) {
                const searchResult = followListData.filter(follow => {
                    let filterLower = searchTerm.toLowerCase()
                    let filterNameLower = `${follow.name}${follow.display_name}`.toLowerCase()
                    return filterNameLower.includes(filterLower)
                })

                setFollowList(searchResult)
            }
            else if (followListData.length < followList.length)
                setFollowList(followListData)

        }, [searchTerm])
    }

    const handleListFollows = async () => {
        setRefreshing(true)

        var friends = await userService.listFollows(user, followsEvent)

        setFollowList(friends.slice(0, loadCombo))

        setFollowListData(friends)

        setRefreshing(false)
    }

    const handleClickFollow = useCallback((follow: User) => {
        if (onPressFollow) onPressFollow(follow)
    }, [])

    const handleLoadScroll = () => {
        setRefreshing(true)
        if (followListData.length > listCounter) {
            setFollowList([...followList, ...followListData.slice(listCounter, listCounter + loadCombo)])
            setListCounter(listCounter + loadCombo)
        }
        setRefreshing(false)
    }

    const handleRenderItem = ({ item }: { item: User }) => <FollowItem key={item.pubkey} follow={item} handleClickFollow={handleClickFollow} />

    return (
        <View>
            <SectionHeader label={labelFriends} icon="people" actions={[{ label: followListData.length.toString(), action: () => { } }]} />
            <FlatList
                data={followList}
                renderItem={handleRenderItem}
                onEndReached={handleLoadScroll}
                onEndReachedThreshold={.3}
                contentContainerStyle={theme.styles.scroll_container}
            />
        </View>
    )
}
