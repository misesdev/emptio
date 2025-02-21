import { userService } from "@src/core/userManager"
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

type Props = { 
    event: NDKEvent, 
    url: string,
}

const VideoFooter = memo(({ event, url }: Props) => {

    const { ndk } = useNDKStore()
    const { user, follows, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [commentsVisible, setCommentsVisible] = useState<boolean>(false)
    const [shareVisible, setShareVisible] = useState<boolean>(false)
    const [reacted, setReacted] = useState<boolean>(false)
    const [reactions, setReactions] = useState<NDKEvent[]>([])

    const isFriend = useMemo(() => !!follows?.some(f => f.pubkey === event.pubkey), [follows, event.pubkey])
    
    useEffect(() => { 
        const fetchData = async () => {
            const filters: NDKFilter[] = [
                { kinds: [0], authors:[event.pubkey], limit: 1 }, // profile
                { kinds: [7], authors:[user.pubkey??""], "#e": [event.id], limit: 1 }, // reaction
            ]
                       
            const events = await ndk.fetchEvents(filters, {
                cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
            })

            events.forEach(note => {
                if(note.kind == 0) setProfile(JSON.parse(note.content) as User)
                if(note.kind == 7) {
                    setReactions(prev => [...prev, note])
                    setReacted(true)
                }
            })
        }
        fetchData()
    }, [event.id, user.pubkey, ndk])

    const handleReact = useCallback(async () => {
        console.log(event.pubkey)
        setReacted(prev => !prev)
        if(!reacted) {
            setTimeout(() => { 
                noteService.reactNote({ note: event, reaction:"❣️" }).then(reaction => {
                    setReactions(prev => [...prev, reaction])
                })
            }, 20)
        }
        if(reacted) {
            setTimeout(() => {
                if(reactions[0]) {
                    noteService.deleteReact(reactions[0]).then(reaction => {
                        setReactions(prev => [...prev.filter(r => r.id != reaction.id)])
                    })
                }
            }, 20)
        }
    }, [event, reactions])

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
            <View style={styles.reactionControls}>
                <TouchableOpacity onPress={handleReact} style={styles.reactionButton}>
                    <Ionicons style={styles.shadow} 
                        name={reacted ? "heart" : "heart-outline"} 
                        size={32} color={theme.colors.white} 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.reactionButton}>
                    <Ionicons style={styles.shadow} name="chatbubble-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShareVisible(true)} style={styles.reactionButton}>
                    <Ionicons style={styles.shadow} name="paper-plane-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.profilebar}>
                <View style={{ width: "15%", paddingHorizontal: 2 }}>
                    <ProfilePicture user={profile} size={50} />
                </View>
                <View style={{ width: "52%", paddingHorizontal: 6 }}>
                    <Text style={[styles.profileName, styles.shadow]}>
                        {getUserName(profile, 24)}
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
                <View style={{ width: "23%", alignItems: "flex-start" }}>
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
                <View style={{ width: "10%", alignItems: "center" }}>
                    <TouchableOpacity style={{ padding: 5 }}>
                        <Ionicons style={styles.shadow} name="ellipsis-vertical" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <VideoDescription content={event.content} url={url} />
            <VideoComments event={event}
                visible={commentsVisible} 
                setVisible={setCommentsVisible} 
            />
            <VideoShareBar event={event} 
                visible={shareVisible} 
                setVisible={setShareVisible} 
            />
        </View>
    )
})

const styles = StyleSheet.create({
    controlsSliderContainer: { width: "95%", position: "absolute", paddingBottom: 4, 
        borderRadius: 5, bottom: 20 },
    controlsSlider: { width: "100%" },

    profilebar: { width: "100%", paddingVertical: 6, flexDirection: "row" },
    profileName: { fontSize: 15, fontWeight: "500", color: theme.colors.white },
    profilePubkey: { fontSize: 12, color: theme.colors.white },
    followbutton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
        borderWidth: 1, borderColor: theme.colors.white, 
        backgroundColor: theme.colors.transparent },

    reactionControls: { position: "absolute", right: 0, bottom: 200 },
    reactionButton: { padding: 6, marginVertical: 4, borderRadius: 10,
        backgroundColor: theme.colors.transparent },

    shadow: { textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6, textShadowColor: theme.colors.black, }
})

export default VideoFooter
