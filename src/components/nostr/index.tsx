import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native"
import { useAuth } from "@src/providers/userProvider"
import { User } from "@src/services/memory/types"
import { useEffect, useState } from "react"
import theme from "@/src/theme"
import { getPairKey } from "@/src/services/memory/pairkeys"
import { listenerEvents } from "@/src/services/nostr/events"

type FriendListProps = {
    searchTerm: string,
    onPressFollow: (user: User) => void,
    loadCombo?: number
}

export const FriendList = ({ searchTerm, onPressFollow, loadCombo = 5 }: FriendListProps) => {

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

        console.log(follows[0].content)

        return followspubkeys
    }

    const handleListFollows = async () => {

        setRefreshing(true)

        var followContents: User[] = []

        var followspubkeys = await listFollowsPubkeys()

        for (let i = 0; i <= followspubkeys.length; i += loadCombo) 
        {
            let authors = followspubkeys.slice(i, i + loadCombo)

            const events = await listenerEvents({ search: searchTerm, kinds: [0], authors, limit: 5 })

            let follows = events.map(event => event.content)

            console.log("listened: ", follows.map(f => f.name).join(", "))

            followContents = followContents.concat(follows)

            setFollowList(followContents)

            if (refreshing)
                setRefreshing(false)
        }


        // for (let follow of followspubkeys) {
        //     let event = await listenerEvents({ search: searchTerm, kinds: [0], authors: [follow], limit: 1 })

        //     if (event[0]?.content)
        //         console.log("listened user: ", event[0]?.content.name, event[0]?.content.about)
        // }

        // for (let follow of followspubkeys) {
        //     listenerEvents({ search: searchTerm, kinds: [0], authors: [follow], limit: 1 }).then(userEvent => {
        //         let userContent = userEvent[0].content
        //         if (userContent)
        //             console.log("listened user: ", userContent.name)
        //     })
        // }

    }

    return (
        <ScrollView
            contentContainerStyle={theme.styles.scroll_container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleListFollows} />}
        >
            {followList &&
                followList.map((follow, key) => {
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
                                        {follow.name}
                                    </Text>
                                </View>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontSize: 12, color: theme.colors.gray, margin: 2, fontWeight: "bold" }}>
                                        {follow.about}
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