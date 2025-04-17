import { User } from "@services/memory/types"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { copyPubkey, getDisplayPubkey, getUserName } from "@src/utils"
import { NDKEvent, NDKFilter, NDKKind, NDKSubscription, NDKSubscriptionCacheUsage, 
    NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
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
import VideoOptionsBar, { showVideoOptions } from "./options"
import VideosFilters from "./filters"

interface FooterVideoProps { 
    event: NostrEvent, 
    url: string,
}

const VideoFooter = ({ event, url }: FooterVideoProps) => {

    const { ndk } = useNDKStore()
    const timeout = useRef<any>(null)
    const subscription = useRef<NDKSubscription>()
    const { user, follows, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [commentsVisible, setCommentsVisible] = useState<boolean>(false)
    const [shareVisible, setShareVisible] = useState<boolean>(false)
    const [reacted, setReacted] = useState<boolean>(false)
    const [reactions, setReactions] = useState<NostrEvent[]>([])
    const [comments, setComments] = useState<NostrEvent[]>([])

    const isFriend = useMemo(() => follows?.some(f => f.pubkey == event.pubkey), [follows, event.pubkey])
    
    useEffect(() => {
        setTimeout(fetchData, 20) 
        const unsubscribe = () => {
            if(timeout.current) clearTimeout(timeout.current)
            if(subscription.current) {
                subscription.current.stop()
                subscription.current.removeAllListeners()
                subscription.current = undefined
            }
        }
        return unsubscribe
    }, [])
    
    const isComment = useCallback((note: NDKEvent) => {
        return note.tags.some(t => t[0] == "e" && t[1] == event.id && t[3] == "root")
    }, [event])

    const fetchData = () => {
        const filters: NDKFilter[] = [
            { kinds: [1], "#e": [event.id??""] }, // comments
            { kinds: [7], "#e": [event.id??""] }, // reactions
            { kinds: [0], authors:[event.pubkey], limit: 1 }, // profile
        ]
               
        subscription.current = ndk.subscribe(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY
        })

        subscription.current.on("event", note => {
            if(note.kind == NDKKind.Metadata) { 
                const user = JSON.parse(note.content) as User
                user.pubkey = note.pubkey
                setProfile(user)
            } else if(note.kind == NDKKind.Text && isComment(note)) { 
                setComments(prev => [...prev, {
                    id: note.id,
                    kind: note.kind,
                    pubkey: note.pubkey,
                    tags: note.tags,
                    content: note.content,
                    created_at: note.created_at,
                    sig: note.sig
                } as NostrEvent])
            } else if(note.kind == NDKKind.Reaction) { 
                setReactions(prev => [...prev, {
                    id: note.id,
                    kind: note.kind,
                    pubkey: note.pubkey,
                    tags: note.tags,
                    content: note.content,
                    created_at: note.created_at,
                    sig: note.sig
                } as NostrEvent])
            }
        })

        timeout.current = setTimeout(() => {
            subscription.current?.stop()
            subscription.current?.removeAllListeners()
            subscription.current = undefined
            setReacted(reactions.some(r => r.pubkey == user.pubkey))
        }, 1200)
    }

    const handleReact = () => {
        setReacted(prev => !prev)
        const reaction: NostrEvent = reactions.find(r => r.pubkey == user.pubkey) as NostrEvent
        if(!reaction) {
            setReactions(prev => [...prev, user as NostrEvent])
            noteService.reactNote({ note: event as NDKEvent, reaction:"❣️" }).then(reaction => {
                setReactions(prev => [...prev.filter(r => r.pubkey != user.pubkey), reaction as NostrEvent])
            })
        }
        if(reaction) {
            setReactions(prev => [...prev.filter(r => r.id != reaction.id)])
            noteService.deleteReact(reaction as NDKEvent)
        }
    }

    const handleFollow = () => {
        follows.push(profile)
        followsEvent?.tags?.push(["p", event.pubkey])
        userService.updateFollows({ user, follows: followsEvent })
    }

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
                            <Ionicons style={styles.shadow} name={reacted ? "heart" : "heart-outline"} size={32} color={theme.colors.white} />
                            {!!reactions.length &&
                                <Text style={[styles.reactionLabel, styles.shadow]}>
                                    {reactions.length}
                                </Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} name="chatbubble-outline" size={32} color={theme.colors.white} />
                            {!!comments.length &&
                                <Text style={[styles.reactionLabel, styles.shadow]}>
                                    {comments.length}
                                </Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShareVisible(true)} style={styles.reactionButton}>
                            <Ionicons style={styles.shadow} name="paper-plane-outline" size={32} color={theme.colors.white} />
                        </TouchableOpacity>
                        <View style={{ height: 20 }}></View>
                        <TouchableOpacity onPress={showVideoOptions} style={styles.reactionButton}>
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
            <VideoOptionsBar event={event} />
            <VideosFilters />
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
    reactionLabel: { minWidth: 34, textAlign: "center", color: theme.colors.white, 
        fontSize: 10, paddingHorizontal: 2 },

    shadow: { textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6, textShadowColor: theme.colors.semitransparent }
})

export default VideoFooter
