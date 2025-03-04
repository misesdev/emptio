import { User } from "@services/memory/types"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { copyPubkey, getDisplayPubkey, getUserName } from "@src/utils"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState, useCallback, useMemo, memo } from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import VideoDescription from "./description"
import { useTranslateService } from "@src/providers/translateProvider"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import { useAuth } from "@src/providers/userProvider"
import VideoComments from "./comments"
import VideoShareBar from "./share"
import { noteService } from "@services/nostr/noteService"
import useNDKStore from "@services/zustand/ndk"
import theme from "@src/theme"
import { userService } from "@services/user"

interface FooterVideoProps { 
    event: NDKEvent, 
    url: string,
}

const VideoFooter = ({ event, url }: FooterVideoProps) => {

    const { ndk } = useNDKStore()
    const { user, follows, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [commentsVisible, setCommentsVisible] = useState<boolean>(false)
    const [shareVisible, setShareVisible] = useState<boolean>(false)
    const [reacted, setReacted] = useState<boolean>(false)
    const [reactions, setReactions] = useState<NDKEvent[]>([])
    const [comments, setComments] = useState<NDKEvent[]>([])

    const isFriend = useMemo(() => !!follows?.some(f => f.pubkey === event.pubkey), [follows, event.pubkey])
    
    useEffect(() => { 
        const fetchData = async () => {
            const filters: NDKFilter[] = [
                { kinds: [1], "#e": [event.id] }, // comments
                { kinds: [0], authors:[event.pubkey], limit: 1 }, // profile
                { kinds: [7], authors:[user.pubkey??""], "#e": [event.id], limit: 1 }, // reaction
            ]
                   
            const subscription = ndk.subscribe(filters, {
                cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
            })

            subscription.on("event", event => {
                if(event.kind == 1) setComments(prev => [...prev, event])
                if(event.kind == 0) setProfile(JSON.parse(event.content) as User)
                if(event.kind == 7) {
                    setReactions(prev => [...prev, event])
                    setReacted(true)
                }
            })

            const finish = () => subscription.removeAllListeners()

            subscription.on("eose", finish)
            subscription.on("close", finish)

            setTimeout(() => subscription.stop(), 500)
        }
        setTimeout(fetchData, 10)
    }, [])

    const handleReact = useCallback(async () => {
        setReacted(prev => !prev)
        setTimeout(() => {
            if(!reacted) {
                noteService.reactNote({ note: event, reaction:"❣️" }).then(reaction => {
                    setReactions(prev => [...prev, reaction])
                })
            }
            if(reacted) {
                if(reactions[0]) {
                    noteService.deleteReact(reactions[0]).then(reaction => {
                        setReactions(prev => [...prev.filter(r => r.id != reaction.id)])
                    })
                }
            }
        }, 20)
    }, [event, reacted, reactions, setReacted, setReactions, noteService])

    const handleFollow = useCallback(async () => {
        setTimeout(async () => {
            if(isFriend) 
                followsEvent!.tags = followsEvent!.tags?.filter(t => t[0] == "p" && t[1] != event.pubkey)
            if(!isFriend)
                followsEvent?.tags?.push(["p", event.pubkey])

            await userService.updateFollows({ user, follows: followsEvent })
        }, 20)
    }, [isFriend, followsEvent, event.pubkey, user])

    return (
        <View style={styles.controlsSliderContainer}>
            <View style={styles.profilebar}>
                <View style={{ width: "88%" }}>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                        <View style={{ width: "18%", paddingHorizontal: 2 }}>
                            <ProfilePicture user={profile} size={50} />
                        </View>
                        <View style={{ width: "60%", paddingHorizontal: 6 }}>
                            <Text style={[styles.profileName, styles.shadow]}>
                                {getUserName(profile, 20)}
                            </Text>
                            <TouchableOpacity activeOpacity={.7} 
                                onPress={() => copyPubkey(event.pubkey)}
                                style={{ flexDirection: "row" }}
                            >
                                <Text style={[styles.profilePubkey, styles.shadow]}>
                                    {getDisplayPubkey(event.pubkey ?? "", 18)}
                                </Text>
                                <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "22%", alignItems: "flex-start" }}>
                            {!isFriend && 
                                <TouchableOpacity activeOpacity={.7} onPress={handleFollow} 
                                    style={styles.followbutton} 
                                >
                                    <Text style={[{ color: theme.colors.white }, styles.shadow]}>
                                        {useTranslate("commons.follow")}
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ width: "100%" }}>
                        <VideoDescription content={event.content} url={url} />
                    </View>
                </View>
                <View style={{ width: "12%", alignItems: "center" }}>
                    <View style={styles.reactionControls}>
                        <TouchableOpacity onPress={handleReact} style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} 
                                name={reacted ? "heart" : "heart-outline"} 
                                size={32} color={theme.colors.white} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} name="chatbubble-outline" size={32} color={theme.colors.white} />
                            <Text style={[styles.reactionLabel, styles.shadow]}>
                                {comments.length}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShareVisible(true)} style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} name="paper-plane-outline" size={32} color={theme.colors.white} />
                        </TouchableOpacity>
                        <View style={{ height: 20 }}></View>
                        <TouchableOpacity style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} name="ellipsis-vertical" size={24} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <VideoComments event={event} comments={comments} visible={commentsVisible} 
                setVisible={setCommentsVisible} 
            />
            <VideoShareBar event={event} visible={shareVisible} 
                setVisible={setShareVisible} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    controlsSliderContainer: { width: "98%", position: "absolute", paddingBottom: 4, 
        borderRadius: 5, bottom: 20 },
    controlsSlider: { width: "100%" },

    profilebar: { width: "100%", paddingVertical: 6, flexDirection: "row" },
    profileName: { fontSize: 15, fontWeight: "500", color: theme.colors.white },
    profilePubkey: { fontSize: 12, color: theme.colors.white },
    followbutton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
        borderWidth: 1, borderColor: theme.colors.white, 
        backgroundColor: theme.colors.transparent },

    reactionControls: { width: "100%", alignItems: "center", position: "absolute", 
        right: 0, bottom: 68 },
    reactionButton: { padding: 6, marginVertical: 4, borderRadius: 10, alignItems: "center" },
    reactionLabel: { color: theme.colors.white, fontSize: 12, paddingHorizontal: 2 },

    shadow: { textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6, textShadowColor: theme.colors.black, }
})

export default memo(VideoFooter, (prev, next) => {
    return prev.url === next.url && prev.event.id === next.event.id
})
