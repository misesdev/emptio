import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { memo, useEffect, useState } from "react"
import { User } from "@src/services/memory/types"
import { getEvent } from "@src/services/nostr/events"
import { nip19 } from "nostr-tools"
import theme from "@src/theme"

type UserItemProps = {
    follow: User,
    handleClickFollow: (follow: User) => void
}

export const FollowItem = memo(({ follow, handleClickFollow }: UserItemProps) => {

    const [followData, setUserData] = useState<User>(follow)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        getEvent({ kinds: [0], authors: [follow.pubkey ?? ""] }).then(event => {
            if (event)
                setUserData({ ...event.content, pubkey: event.pubkey })
        })
    }

    return (
        <TouchableOpacity
            activeOpacity={.7}
            style={styles.sectionUser}
            onPress={() => handleClickFollow(followData)}
        >
            {/* Transaction Type */}
            <View style={styles.profileArea}>
                <View style={styles.profileView}>
                    {followData.picture && <Image source={{ uri: followData.picture }} style={styles.profile} />}
                    {!followData.picture && <Image source={require("assets/images/defaultProfile.png")} style={styles.profileView} />}
                </View>
            </View>
            {/* Transaction Description and Date */}
            <View style={{ width: "80%", minHeight: 75 }}>
                <View style={{ width: "100%" }}>
                    <Text style={styles.userName}>
                        {
                            (followData.name ?? followData.display_name ?? nip19.npubEncode(followData.pubkey ?? "")).substring(0, 17)
                        }
                    </Text>
                </View>
                <View style={{ width: "100%" }}>
                    <Text style={styles.userAbout}>
                        {(followData.about ?? "").substring(0, 50)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    profile: { flex: 1 },
    profileView: { width: 50, height: 50, borderRadius: 50, overflow: 'hidden' },
    profileArea: { width: "20%", minHeight: 75, justifyContent: "center", alignItems: "center" },
    userName: { color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 },
    userAbout: { fontSize: 12, color: theme.colors.gray, margin: 2, paddingRight: 8, paddingBottom: 8, fontWeight: "bold" },
    sectionUser: { width: "96%", minHeight: 75, maxHeight: 120, borderRadius: 23, marginVertical: 4, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" }
})
