import { userService } from "@src/core/userManager"
import { User } from "@services/memory/types"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { copyPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState } from "react"
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"
import VideoDescription from "./description"
import theme from "@src/theme"
import { useTranslateService } from "@/src/providers/translateProvider"
import useNDKStore from "@/src/services/zustand/ndk"
import { useAuth } from "@/src/providers/userProvider"
import { messageService } from "@/src/core/messageManager"

type Props = { 
    event: NDKEvent, 
    url: string,
}

const VideoFooter = ({ event, url }: Props) => {

    const { user, follows } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [isFriend, setIsFriend] = useState<boolean>(true)
    const [liked, setLiked] = useState<boolean>(false)
    const [profileError, setProfileError] = useState<boolean>(false)
    const [chatEvents, setChatEvents] = useState<NDKEvent[]>([])
    
    useEffect(() => {
        const friends = follows?.tags?.filter(t => t[0] == "p").map(t => t[1])
        setIsFriend(friends?.includes(event.pubkey) ?? false)
        
        userService.getProfile(event.pubkey).then(setProfile)
    }, [event.pubkey])

    const handleReact = async () => {
        if(!liked) 
            setTimeout(() => { event.react("❣️") }, 50)
        else
            setTimeout(() => { event.react("❣️", false)}, 50)

        setLiked(prev => !prev)
    }

    const handleOpenChat = async () => {
        messageService.listAnswers(event).then(events => {
            setChatEvents(events)
            console.log(events)
        })
    }

    const handleShare = () => {

    }

    const handleFollow = async () => {
        if(isFriend) 
            follows!.tags = follows!.tags?.filter(t => t[0] == "p" && t[1] != event.pubkey)
        if(!isFriend)
            follows?.tags?.push(["p", event.pubkey])

        userService.updateFollows({ user, follows }) 
        setIsFriend(prev => !prev)
    }

    return (
        <View style={styles.controlsSliderContainer}>
            <View style={styles.reactionControls}>
                <TouchableOpacity onPress={handleReact}
                    style={styles.reactionButton}>
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={32} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenChat}
                    style={styles.reactionButton}>
                    <Ionicons name="chatbubble-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}
                    style={styles.reactionButton}>
                    <Ionicons name="paper-plane-outline" size={32} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.profilebar}>
                <View style={{ width: "15%", paddingHorizontal: 2 }}>
                    <View style={styles.profile}>
                        {profile.picture && 
                            <Image onError={() => setProfileError(true)} source={{ uri: profile.picture }} style={styles.profile}/>
                        }
                        {(!profile.picture || profileError) && 
                            <Image source={require("@assets/images/defaultProfile.png")} style={styles.profile}/>
                        }
                    </View>
                </View>
                <View style={{ width: "60%", paddingHorizontal: 6 }}>
                    <Text style={styles.profileName}>
                        {getUserName(profile, 24)}
                    </Text>
                    <TouchableOpacity activeOpacity={.7} 
                        onPress={() => copyPubkey(profile.pubkey ?? "")}
                        style={{ flexDirection: "row" }}
                    >
                        <Text style={{ textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 5,
                            textShadowColor: theme.colors.black,
                            color: theme.colors.white }}>
                            {getDisplayPubkey(profile.pubkey ?? "", 18)}
                        </Text>
                        <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "25%", paddingVertical: 10, flexDirection: "row" }}>
                    <TouchableOpacity activeOpacity={.7} onPress={handleFollow} 
                        style={styles.followbutton} 
                    >
                        <Text style={{ color: theme.colors.white }}>
                            {isFriend && useTranslate("commons.unfollow")}
                            {!isFriend && useTranslate("commons.follow")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <VideoDescription content={event.content} url={url} />
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
