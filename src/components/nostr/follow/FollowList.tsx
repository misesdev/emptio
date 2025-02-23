import { FlatList, View } from "react-native"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@services/memory/types"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { walletService } from "@src/core/walletManager"
import { FollowItem } from "./FollowItem"
import theme from "@src/theme"
import { getUserName } from "@src/utils"
import { SearchBox } from "../../form/SearchBox"
import { useTranslateService } from "@/src/providers/translateProvider"

type FriendListProps = {
    toSend?: boolean,
    toOpen?: boolean,
    toView?: boolean,
    toInvite?: boolean,
    toFollow?: boolean,
    toPayment?: boolean,
    searchable?: boolean,
    searchTimout?: number,
    onPressFollow?: (user: User) => void,
}

export const FollowList = ({ onPressFollow, toPayment=false, searchable, toView=false, 
    searchTimout=200, toSend=false, toFollow=false, toOpen=false, toInvite=false
}: FriendListProps) => {

    const { follows } = useAuth()
    const listRef = useRef<FlatList>(null)
    const { useTranslate } = useTranslateService()
    const [followList, setFollowList] = useState<User[]>(follows??[])
    const memorizedFollows = useMemo(() => followList, [followList])
    
    const handleSearch = (filter: string) => {
        if (filter?.length && !walletService.address.validate(filter)) {
            const searchResult = follows?.filter(follow => {
                let filterNameLower = getUserName(follow, 30).toLowerCase()
                return filterNameLower.includes(filter.toLowerCase())
            })

            setFollowList(searchResult ?? [])
        }
        else setFollowList(follows??[])
    }
   
    const handleClickFollow = useCallback((follow: User) => {
        if (onPressFollow)
            onPressFollow(follow)
    }, [onPressFollow])

    const ListItem = memo(({ item }: { item: User }) => (
        <FollowItem isFriend follow={item} toFollow={toFollow} toView={toView}
            toOpen={toOpen} toSend={toSend} toInvite={toInvite}
            handleClickFollow={handleClickFollow} 
        />
    ))

    const renderItem = useCallback(({ item }: { item: User }) => {
        return <ListItem item={item} />
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {searchable &&
                <SearchBox delayTime={searchTimout} seachOnLenth={0}
                    label={useTranslate("commons.search")} 
                    onSearch={handleSearch}
                />    
            }
            <FlatList 
                ref={listRef}
                data={memorizedFollows}
                renderItem={renderItem}
                contentContainerStyle={[theme.styles.scroll_container, { paddingBottom: 30 }]}
                keyExtractor={item => item.pubkey ?? Math.random().toString()}
            />
        </View>
    )
}


