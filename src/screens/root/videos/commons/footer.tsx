import { userService } from "@src/core/userManager"
import { User } from "@services/memory/types"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { copyPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState, useRef } from "react"
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"
import VideoDescription from "./description"
import { useTranslateService } from "@src/providers/translateProvider"
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

const VideoFooter = ({ event, url }: Props) => {

    const { ndk } = useNDKStore()
    const { user, follows, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const profile = useRef<User>({})
    const isFriend = useRef<boolean>(false)
    const [profileError, setProfileError] = useState<boolean>(false)
    const [commentsVisible, setCommentsVisible] = useState<boolean>(false)
    const [shareVisible, setShareVisible] = useState<boolean>(false)
    const reactions = useRef<NDKEvent[]>([])
    
    useEffect(() => { setTimeout(handleLoadData, 20) }, [])

    const handleLoadData = async () => {
        console.log("load data footer")
        isFriend.current = !!follows?.find(f => f.pubkey == event.pubkey)

        const filters: NDKFilter[] = [
            { kinds: [0], authors:[event.pubkey], limit: 1 }, // profile
            { kinds: [7], authors:[user.pubkey??""], "#e": [event.id], limit: 1 }, // reaction
        ]
                   
        const events = await ndk.fetchEvents(filters, {
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        })

        events.forEach(note => {
            if(note.kind == 0) profile.current = JSON.parse(note.content) as User
            if(note.kind == 7) reactions.current = [...reactions.current, note]
        })
    }

    const handleReact = async () => {
        if(!reactions.current.length) {
            noteService.reactNote({ note: event, reaction:"❣️" }).then(reaction => {
                reactions.current = [...reactions.current, reaction]
            })
        }
        else {
            noteService.deleteReact(reactions.current[0]).then(reaction => {
                reactions.current = reactions.current.filter(r => r.id != reaction.id)
            })  
        }
    }

    const handleOpenChat = () => setCommentsVisible(true)

    const handleShare = () => setShareVisible(true)

    const handleFollow = async () => {
        isFriend.current = !isFriend.current 

        setTimeout(async () => {
            if(isFriend.current) 
                followsEvent!.tags = followsEvent!.tags?.filter(t => t[0] == "p" && t[1] != event.pubkey)
            if(!isFriend.current)
                followsEvent?.tags?.push(["p", event.pubkey])

            await userService.updateFollows({ user, follows: followsEvent })
        }, 20)
    }

    return (
        <View style={styles.controlsSliderContainer}>
            <View style={styles.reactionControls}>
                <TouchableOpacity onPress={handleReact} style={styles.reactionButton}>
                    <Ionicons 
                        name={reactions.current.length ? "heart" : "heart-outline"} 
                        size={32} color={theme.colors.white} 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenChat} style={styles.reactionButton}>
                    <Ionicons name="chatbubble-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.reactionButton}>
                    <Ionicons name="paper-plane-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.profilebar}>
                <View style={{ width: "15%", paddingHorizontal: 2 }}>
                    <View style={styles.profile}>
                        {profile.current.picture && 
                            <Image onError={() => setProfileError(true)} source={{ uri: profile.current.picture }} style={styles.profile}/>
                        }
                        {(!profile.current.picture || profileError) && 
                            <Image source={require("@assets/images/defaultProfile.png")} style={styles.profile}/>
                        }
                    </View>
                </View>
                <View style={{ width: "60%", paddingHorizontal: 6 }}>
                    <Text style={styles.profileName}>
                        {getUserName(profile.current, 24)}
                    </Text>
                    <TouchableOpacity activeOpacity={.7} 
                        onPress={() => copyPubkey(event.pubkey)}
                        style={{ flexDirection: "row" }}
                    >
                        <Text style={{ textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 5,
                            textShadowColor: theme.colors.black,
                            color: theme.colors.white }}>
                            {getDisplayPubkey(event.pubkey ?? "", 18)}
                        </Text>
                        <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "25%", paddingVertical: 10, flexDirection: "row" }}>
                    <TouchableOpacity activeOpacity={.7} onPress={handleFollow} 
                        style={styles.followbutton} 
                    >
                        {isFriend.current &&
                            <Text style={{ color: theme.colors.white }}>
                                {useTranslate("commons.unfollow")}
                            </Text>
                        }
                        {!isFriend.current && 
                            <Text style={{ color: theme.colors.white }}>
                                {useTranslate("commons.follow")}
                            </Text>
                        }
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
}

const styles = StyleSheet.create({
    controlsSliderContainer: { width: "95%", position: "absolute", paddingBottom: 4, 
        borderRadius: 5, bottom: 20 },
    controlsSlider: { width: "100%" },

    profilebar: { width: "100%", paddingVertical: 6, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden",
        backgroundColor: theme.colors.black },
    profileName: { textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 8,
        textShadowColor: theme.colors.black, fontSize: 16, fontWeight: "500", 
        color: theme.colors.white },
    followbutton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
        borderWidth: .5, borderColor: theme.colors.white, backgroundColor: theme.colors.blue },

    reactionControls: { position: "absolute", right: 0, bottom: 200, 
        padding: 4 },
    reactionButton: { padding: 6, marginVertical: 4, borderRadius: 10,
        backgroundColor: theme.colors.semitransparent }
})

export default VideoFooter
