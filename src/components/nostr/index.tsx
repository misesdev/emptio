import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native"
import { listenerEvents } from "@src/services/nostr/events"
import { userService } from "@/src/core/userManager"
import { useTranslate } from "@/src/services/translate"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { NDKRelay } from "@nostr-dev-kit/ndk"
import { useEffect, useState } from "react"
import theme from "@/src/theme"

type FriendListProps = {
    searchTerm?: string,
    onPressFollow?: (user: User) => void,
    loadCombo?: number,
    toPayment?: boolean
}

export const FriendList = ({ searchTerm, onPressFollow, loadCombo = 20, toPayment = false }: FriendListProps) => {

    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [followList, setFollowList] = useState<User[]>([])
    const [followListData, setFollowlistData] = useState<User[]>([])

    useEffect(() => {
        // search and filter
        if (searchTerm) {
            const searchResult = followListData.filter(follow => {
                let filterLower = searchTerm.toLowerCase()
                let filterNameLower = `${follow.name}${follow.display_name}${follow.displayName}`.toLowerCase()
                return filterNameLower.includes(filterLower)
            })

            setFollowList(searchResult)
        }
        else
            setFollowList(followListData)
    }, [searchTerm])

    useEffect(() => {
        handleListFollows()
    }, [])

    const handleListFollows = async () => {

        setRefreshing(true)

        var followContents: User[] = []

        var followspubkeys = await userService.listFollowsPubkeys(user)

        setFollowList(followspubkeys.slice(0, 5).map(i => { return { name: userService.convertPubkey(i) } }))

        for (let i = 0; i <= followspubkeys.length; i += loadCombo) 
        {
            let authors = followspubkeys.slice(i, i + loadCombo)

            let events = await listenerEvents({ search: searchTerm, kinds: [0], authors, limit: loadCombo })

            let follows = events.map(event => event.content)

            followContents = followContents.concat(follows)

            setFollowlistData(followContents)

            setFollowList(followContents)
        }

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
            {followList &&
                followList.map((follow, key) => {

                    var userName = follow.name ? follow.name : follow.display_name
                    var userAbout: string = ""

                    if (userName!.length > 24)
                        userName = `${userName?.substring(0, 23)}...`

                    if (follow.about)
                        userAbout = follow.about.length > 80 ? `${follow.about?.substring(0, 80)}...` : follow.about

                    return (
                        <TouchableOpacity style={styles.sectionTransaction} onPress={() => handleClickUser(follow)} key={key} activeOpacity={.7}>
                            {/* Transaction Type */}
                            <View style={{ width: "20%", minHeight: 75, justifyContent: "center", alignItems: "center" }}>
                                {follow.picture && <Image source={{ uri: follow.picture }} style={styles.profile} />}
                                {!follow.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.profile} />}
                            </View>
                            {/* Transaction Description and Date */}
                            <View style={{ width: "80%", minHeight: 75 }}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 }}>
                                        {userName}
                                    </Text>
                                </View>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, paddingRight: 8, paddingBottom: 8, fontWeight: "bold" }}>
                                        {userAbout}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }

            {!followList &&
                <Text style={{ color: theme.colors.gray, textAlign: "center" }}>
                    {useTranslate("section.title.frends.empty")}
                </Text>
            }
            <View style={{ height: 75 }}></View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    profile: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    sectionTransaction: {
        width: "96%",
        minHeight: 75,
        maxHeight: 120,
        borderRadius: 23,
        marginVertical: 4,
        flexDirection: "row",
        backgroundColor: "rgba(0, 55, 55, .2)"
    }
})