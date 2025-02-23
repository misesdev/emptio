import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { User } from "@services/memory/types"
import { memo } from "react"
import theme from "@src/theme"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getDisplayPubkey, getUserName } from "@/src/utils"
import { useTranslateService } from "@/src/providers/translateProvider"
import { ProfilePicture } from "../user/ProfilePicture"

type UserItemProps = {
    follow: User,
    toOpen?: boolean,
    toSend?: boolean,
    toInvite?: boolean,
    toView?: boolean,
    toFollow?: boolean,
    toManage?: boolean,
    isFriend?: boolean,
    handleClickFollow: (follow: User) => void
}

export const FollowItem = memo(({ follow, handleClickFollow, toSend=false, toView=false,
    toFollow=false, isFriend=false, toOpen=false, toManage=false, toInvite=false
}: UserItemProps) => {

    const { useTranslate } = useTranslateService()

    const handleClick = (toFollow||toSend||toOpen) 
            ? () => {} : () => handleClickFollow(follow)

    return (
        <TouchableOpacity
            activeOpacity={.6}
            style={styles.sectionUser}
            onPress={handleClick}
        >
            <View style={styles.profileArea}>
                <ProfilePicture user={follow} size={50} />
                {isFriend && toFollow &&
                    <Text style={styles.friendtag}>
                        <Ionicons name="beer" size={16} color={theme.colors.yellow} />
                    </Text>
                }
            </View>
            <View style={{ width: "56%", minHeight: 70 }}>
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <Text style={styles.userName}>
                        {getUserName(follow, 22)}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <Text style={styles.userAbout}>
                        {getDisplayPubkey(follow.pubkey ?? "", 24)}
                    </Text>
                </View>
            </View>    
            <View style={{ width: "28%", alignItems: "center", paddingVertical: 10 }}>
                <TouchableOpacity 
                    style={{ padding: 8, paddingHorizontal: 18, borderRadius: 10,
                        backgroundColor: theme.colors.section 
                    }}
                    onPress={() => handleClickFollow(follow)} 
                >
                    <Text style={{ fontSize: 12, fontWeight: "500", color: theme.colors.white }}>
                        {(toManage && isFriend) && useTranslate("commons.remove")} 
                        {(toManage && !isFriend) && useTranslate("commons.add")} 
                        {(toFollow && isFriend) && useTranslate("commons.unfollow")} 
                        {(toFollow && !isFriend) && useTranslate("commons.follow")} 
                        {toView && useTranslate("commons.details")} 
                        {toOpen && useTranslate("commons.open")} 
                        {toSend && useTranslate("commons.send")} 
                        {toInvite && useTranslate("commons.invite")} 
                    </Text>
                </TouchableOpacity> 
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    profile: { width: 50, height: 50 },
    profileView: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, overflow: 'hidden' },
    profileArea: { width: "16%", minHeight: 65, justifyContent: "center", alignItems: "center" },
    userName: { color: theme.colors.white, fontFamily: "", fontSize: 14, fontWeight: "600", 
        margin: 2, marginTop: 12 },
    userAbout: { fontSize: 12, color: theme.colors.gray, margin: 2, paddingRight: 8, 
        paddingBottom: 8, fontWeight: "bold" },
    sectionUser: { width: "98%", minHeight: 65, maxHeight: 120, borderRadius: 10,
        marginVertical: 1, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" },
    friendtag: { position: "absolute", bottom: 2, right: -5, padding: 8 }
})
