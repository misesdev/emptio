import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { useEffect, useState } from "react"
import theme from "@/src/theme"
import { getPairKey } from "@/src/services/memory/pairkeys"
import { listenerEvents } from "@/src/services/nostr/events"
import { NDKRelay } from "@nostr-dev-kit/ndk"

type FriendListProps = {
    searchTerm: string,
    onPressFollow: (user: User) => void,
    loadCombo?: number,
    toPayment?: boolean
}

export const FriendList = ({ searchTerm, onPressFollow, loadCombo = 30, toPayment = false }: FriendListProps) => {

    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [followList, setFollowList] = useState<User[]>([])

    useEffect(() => {
        handleListFollows()
    }, [])

    const listFollowsPubkeys = async (): Promise<string[]> => {

        const { publicKey } = await getPairKey(user.keychanges ?? "")

        const follows = await listenerEvents({ limit: 1, authors: [publicKey], kinds: [3] })

        const followspubkeys = follows[0].tags.map(tag => tag[1])

        // if (follows[0].content) {
        //     for (let relay in follows[0].content) {
        //         if (relay.includes("wss://")) 
        //             Nostr.addExplicitRelay(relay)
        //     }
        // }

        return followspubkeys
    }

    const handleListFollows = async () => {

        setRefreshing(true)

        var followContents: User[] = []

        var followspubkeys = await listFollowsPubkeys()

        setFollowList(followspubkeys.slice(0, 5).map(i => { return {} }))

        for (let i = 0; i <= followspubkeys.length; i += loadCombo) {
            let authors = followspubkeys.slice(i, i + loadCombo)

            const events = await listenerEvents({ search: searchTerm, kinds: [0], authors, limit: loadCombo })

            let follows = events.map(event => event.content)

            followContents = followContents.concat(follows)

            setFollowList(followContents)
        }

        setRefreshing(false)
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

                    if (follow.about)
                        userAbout = follow.about.length > 80 ? `${follow.about?.substring(0, 80)}...` : follow.about

                    return (
                        <TouchableOpacity style={styles.sectionTransaction} onPress={() => onPressFollow(follow)} key={key} activeOpacity={.7}>
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