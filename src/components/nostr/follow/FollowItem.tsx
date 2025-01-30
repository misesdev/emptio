import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { User } from "@services/memory/types"
import { hexToNpub } from "@services/converter"
import { useTranslate } from "@services/translate"
import { memo, useEffect, useState } from "react"
import theme from "@src/theme"

type UserItemProps = {
    follow: User,
    toFollow?: boolean,
    isFriend?: boolean,
    handleClickFollow: (follow: User) => void
}

export const FollowItem = memo(({ follow, handleClickFollow, toFollow = false, isFriend = false }: UserItemProps) => {

    const [isFriendMessage, setIsFriendMessage] = useState("")
    useEffect(() => { 
        useTranslate("friends.user.is-friend").then(setIsFriendMessage)
    }, [])

    return (
        <TouchableOpacity
            activeOpacity={.7}
            style={styles.sectionUser}
            onPress={() => handleClickFollow(follow)}
        >
            {/* Transaction Type */}
            <View style={styles.profileArea}>
                <View style={styles.profileView}>
                    {follow.picture && <Image onError={() => follow.picture = ""} source={{ uri: follow.picture }} style={styles.profile} />}
                    {!follow.picture && <Image source={require("@assets/images/defaultProfile.png")} style={styles.profileView} />}
                </View>
            </View>
            {/* Transaction Description and Date */}
            <View style={{ width: "80%", minHeight: 75 }}>
                <View style={{ width: "100%" }}>
                    <Text style={styles.userName}>
                        {
                            (follow.display_name ?? follow.name ?? hexToNpub(follow.pubkey ?? "")).substring(0, 17)
                        }
                    </Text>
                </View>
                <View style={{ width: "100%" }}>
                    <Text style={styles.userAbout}>
                        {hexToNpub(follow.pubkey ?? "").substring(0, 38)}..
                    </Text>
                </View>
                {isFriend && toFollow &&
                    <Text style={{ position: "absolute", right: 10, top: -2, paddingHorizontal: 12, 
                        borderRadius: 5, fontWeight: "400", fontSize: 11, paddingVertical: 3,
                        color: theme.colors.white, backgroundColor: theme.colors.blue }}>
                        {isFriendMessage}
                    </Text>
                }
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
