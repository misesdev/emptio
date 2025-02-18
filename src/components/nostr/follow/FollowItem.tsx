import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { User } from "@services/memory/types"
import { memo, useEffect, useState } from "react"
import theme from "@src/theme"
import { getColorFromPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { useTranslateService } from "@/src/providers/translateProvider"
import { ProfilePicture } from "../user/ProfilePicture"

type UserItemProps = {
    follow: User,
    toOpen?: boolean,
    toSend?: boolean,
    toFollow?: boolean,
    isFriend?: boolean,
    handleClickFollow: (follow: User) => void
}

export const FollowItem = memo(({ follow, handleClickFollow, toSend=false, 
    toFollow=false, isFriend=false, toOpen=false }: UserItemProps) => {

    const { useTranslate } = useTranslateService()

    const handleClick = (toFollow||toSend||toOpen) 
            ? () => {} : () => handleClickFollow(follow)

    return (
        <TouchableOpacity
            activeOpacity={.7}
            style={styles.sectionUser}
            onPress={handleClick}
        >
            <View style={styles.profileArea}>
                <ProfilePicture user={follow} size={50} />
            </View>
            <View style={{ width: "60%", minHeight: 70 }}>
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
                        {useTranslate("friends.user.is-friend")}
                    </Text>
                }
            </View>    
            <View style={{ width: "24%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity 
                    style={{ padding: 8, paddingHorizontal: 18, borderRadius: 10,
                        backgroundColor: theme.colors.section 
                    }}
                    onPress={() => handleClickFollow(follow)} 
                >
                    <Text style={{fontWeight: "500", color: theme.colors.white}}>
                        {(toFollow && isFriend) && useTranslate("commons.unfollow")} 
                        {(toFollow && !isFriend) && useTranslate("commons.follow")} 
                        {toOpen && useTranslate("commons.open")} 
                        {toSend && useTranslate("commons.send")} 
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
        marginVertical: 1, flexDirection: "row", backgroundColor: "rgba(0, 55, 55, .2)" }
})
