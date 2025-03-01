import { Modal, StyleSheet, View, Text, Image, ScrollView,
    TouchableOpacity } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import Ionicons from "react-native-vector-icons/Ionicons"
import { User } from "@services/memory/types"
import { copyPubkey, getDisplayPubkey, getUserName } from "@src/utils"
import ContentViewer from "@components/nostr/event/ContentViewer"
import { useAuth } from "@src/providers/userProvider"
import { useCallback, useState } from "react"
import { userService } from "@src/core/userManager"
import theme from "@src/theme"

interface ProfileViewProps { profile: User }

var showProfileFunction: ({ profile }: ProfileViewProps) => void

const ProfileView = () => {

    const { user, follows, setFollows, followsEvent, setFollowsEvent } = useAuth()
    const [visible, setVisible] = useState(false)
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [pictureError, setPictureError] = useState(false)
    const [isFriend, setIsFriend] = useState(false)

    showProfileFunction = useCallback(({ profile }: ProfileViewProps) => {
        setIsFriend(!!follows.find(f => f.pubkey == profile.pubkey))
        setProfile(profile)
        setVisible(true)
    }, [follows, setIsFriend, setProfile, setVisible])

    const handleFollow = useCallback(async () => {
        setIsFriend(prev => !prev)
        setTimeout(async () => {
            if(!follows.find(f => f.pubkey == profile.pubkey)) {    
                followsEvent?.tags?.push(["p", profile.pubkey ?? ""])
                if(setFollows && follows) setFollows([profile,...follows])
            } else {
                followsEvent!.tags = followsEvent?.tags?.filter(t => t[0] == "p" && t[1] != profile.pubkey) ?? []
                if(setFollows && follows) 
                    setFollows([...follows.filter(f => f.pubkey != profile.pubkey)])
            }
            //if(setFollowsEvent && followsEvent) setFollowsEvent(followsEvent)
            await userService.updateFollows({ 
                follows: followsEvent,
                user
            })
        }, 20)
    }, [profile, follows, followsEvent, setFollows, userService])

    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {/* {useTranslate("feed.videos.share")} */}
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ }}
                        contentContainerStyle={{ padding: 8, justifyContent: "center" }}
                    >
                        {(!pictureError && profile.banner) &&
                            <View style={{ width: "100%", height: 200, borderRadius: 10, overflow: "hidden" }}>
                                <Image onError={() => setPictureError(true)}
                                    source={{ uri: profile.banner }} style={{ flex: 1 }}
                                />
                            </View>
                        }
                        <View style={[{ width: "100%", zIndex: 99, flexDirection: "row" },
                                (!pictureError && profile.banner) ? {
                                marginTop: -65        
                                } : {}
                            ]}
                        >
                            <View style={{ width: "70%", paddingVertical: 10, flexDirection: "row" }}>
                                <View style={{ width: "32%" }}>
                                    <ProfilePicture size={75} user={profile}/>
                                </View>
                                <View style={{ width: "68%" }}>
                                    <Text style={[styles.shadow, { fontSize: 16, fontWeight: "bold", color: theme.colors.white }]}>
                                        {getUserName(profile, 20)}
                                    </Text>
                                    <TouchableOpacity 
                                        activeOpacity={.7}
                                        onPress={() => copyPubkey(profile.pubkey ?? "")}
                                        style={{ flexDirection: "row" }}
                                    >
                                        <Text style={[styles.pubkey, styles.shadow]}>
                                            {getDisplayPubkey(profile.pubkey ?? "", 17)}
                                        </Text>
                                        <Ionicons name="copy" size={14} style={{ padding: 5 }} color={theme.colors.gray} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: "30%", padding: 10, alignItems: "flex-end" }}>
                                <TouchableOpacity onPress={handleFollow} activeOpacity={.7}
                                    style={[{ padding: 6, borderRadius: 10,
                                        paddingHorizontal: 14, backgroundColor: theme.colors.blue
                                    }]}
                                >
                                    <Text style={{ fontWeight: "500", color: theme.colors.white }}>
                                        {isFriend ? useTranslate("commons.unfollow") : useTranslate("commons.follow")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {profile.about &&
                            <ContentViewer content={profile.about} />
                        }
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export const ShowProfileView = (props: ProfileViewProps) => {
    setTimeout(() => showProfileFunction(props), 10)
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent },
    modalContainer: { height: "50%", backgroundColor: theme.colors.semitransparentdark,
        borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10 },
    headerText: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: "#555" },
    pubkey: { fontSize: 12, fontWeight: "400", color: theme.colors.gray },
    shadow: { textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6, 
        textShadowColor: theme.colors.semitransparentdark },
})

export default ProfileView 
