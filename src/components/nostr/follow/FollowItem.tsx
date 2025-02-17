import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { User } from "@services/memory/types"
import { useTranslate } from "@services/translate"
import { memo, useEffect, useState } from "react"
import theme from "@src/theme"
import { copyPubkey, getDisplayPubkey, getUserName } from "@/src/utils"

type UserItemProps = {
    follow: User,
    toFollow?: boolean,
    isFriend?: boolean,
    handleClickFollow: (follow: User) => void
}

export const FollowItem = memo(({ follow, handleClickFollow, toFollow = false, isFriend = false }: UserItemProps) => {

    const [pictureError, setPictureError] = useState(false)
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
            <View style={styles.profileArea}>
                <View style={styles.profileView}>
                    <Image style={styles.profile}
                        onError={() => setPictureError(true)}
                        source={(pictureError || !follow.picture) ? require("@assets/images/defaultProfile.png") 
                            : { uri: follow.picture }
                        } 
                    />
                </View>
            </View>
            <View style={{ width: "80%", minHeight: 75 }}>
                <View style={{ width: "100%" }}>
                    <Text style={styles.userName}>
                        {getUserName(follow, 24)}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <Text style={styles.userAbout}>
                        {getDisplayPubkey(follow.pubkey ?? "", 24)}
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
    profile: { width: 50, height: 50, borderRadius: 50 },
    profileView: { width: 50, height: 50, borderRadius: 50, overflow: 'hidden' },
    profileArea: { width: "20%", minHeight: 75, justifyContent: "center", alignItems: "center" },
    userName: { color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", margin: 2, marginTop: 12 },
    userAbout: { fontSize: 12, color: theme.colors.gray, margin: 2, paddingRight: 8, paddingBottom: 8, fontWeight: "bold" },
    sectionUser: { width: "98%", minHeight: 75, maxHeight: 120, borderRadius: 10, marginVertical: 4, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" }
})
