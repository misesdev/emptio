import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native"
import { listenerEvents } from "@src/services/nostr/events"
import { userService } from "@/src/core/userManager"
import { useTranslate } from "@/src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { NDKRelay } from "@nostr-dev-kit/ndk"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { walletService } from "@src/core/walletManager"
import FollowItem from "./FollowItem"

type FriendListProps = {
    searchTerm?: string,
    onPressFollow?: (user: User) => void,
    loadCombo?: number | "max",
    toPayment?: boolean,
    searchable?: boolean
}

export const FriendList = ({ searchTerm, onPressFollow, loadCombo = 20, toPayment = false, searchable }: FriendListProps) => {

    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [followList, setFollowList] = useState<User[]>([])
    const [followListData, setFollowlistData] = useState<User[]>([])

    useEffect(() => { handleListFollows() }, [])

    if (searchable) {
        useEffect(() => {
            // search and filter
            if (searchTerm && !walletService.address.validate(searchTerm)) {
                const searchResult = followListData.filter(follow => {
                    let filterLower = searchTerm.toLowerCase()
                    let filterNameLower = `${follow.name}${follow.display_name}${follow.displayName}`.toLowerCase()
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

        // var followContents: User[] = []

        var follows = await userService.listFollowsPubkeys(user)

        // var rowLimitFind = loadCombo === "max" ? followspubkeys.length : loadCombo

        setFollowList(follows)

        // for (let i = 0; i < followspubkeys.length; i += rowLimitFind) {
        //     let authors = followspubkeys.slice(i, i + rowLimitFind)

        //     let events = await listenerEvents({ search: searchTerm, kinds: [0], authors, limit: rowLimitFind, since: 0 })

        //     let follows = events.map(event => { return { ...event.content, pubkey: event.pubkey } })

        //     followContents = followContents.concat(follows)

        //     setFollowlistData(followContents)

        //     setFollowList(followContents)
        // }

        setRefreshing(false)
    }

    const handleClickUser = (follow: User) => {
        if (onPressFollow)
            onPressFollow(follow)
    }

    return (
        <ScrollView
            contentContainerStyle={theme.styles.scroll_container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleListFollows} />}
        >
            {followList && followList.map((follow, key) => <FollowItem key={follow.pubkey} follow={follow} />)}

            {!followList.length &&
                <Text style={{ color: theme.colors.gray, textAlign: "center" }}>
                    {useTranslate("section.title.frends.empty")}
                </Text>
            }
            <View style={{ height: 75 }}></View>
        </ScrollView>
    )
}
