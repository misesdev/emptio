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

type Props = { 
    event: NDKEvent, 
    url: string,
}

const VideoFooter = ({ event, url }: Props) => {

    const { ndk } = useNDKStore()
    const { follows } = useAuth()
    const { useTranslate } = useTranslateService()
    const [profile, setProfile] = useState<User>({})
    const [isFriend, setIsFriend] = useState<boolean>(true)
    const [profileError, setProfileError] = useState<boolean>(false)
    
    useEffect(() => {
        userService.getProfile(event.pubkey).then(setProfile)
        const friends = follows?.tags?.filter(t => t[0] == "p").map(t => t[1])
        setIsFriend(friends?.includes(event.pubkey) ?? false)
    }, [event.pubkey])

    const handleReact = () => {

    }

    const handleOpenChat = () => {

    }

    const handleShare = () => {

    }

    const handleFollow = async () => {
        setIsFriend(prev => !prev)
        //event.author.follow() 
    }

    return (
        <View style={styles.controlsSliderContainer}>
            <View style={styles.reactionControls}>
                <TouchableOpacity onPress={handleReact}
                    style={styles.reactionButton}>
                    <Ionicons name="heart-outline" size={32} color={theme.colors.white} />
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
                <View style={{ width: "62%", paddingHorizontal: 6 }}>
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
                <View style={{ width: "23%", padding: 10, flexDirection: "row" }}>
                    { !isFriend &&
                        <TouchableOpacity activeOpacity={.7} onPress={handleFollow} 
                            style={styles.followbutton} 
                        >
                            <Text style={{ color: theme.colors.white }}>
                                {useTranslate("commons.follow")}
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <VideoDescription content={event.content} url={url} />
        </View>
    )
}

const styles = StyleSheet.create({
    controlsSliderContainer: { width: "95%", position: "absolute", padding: 1, 
        borderRadius: 5, bottom: 20 },
    controlsSlider: { width: "100%" },

    profilebar: { width: "100%", paddingVertical: 6, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden",
        backgroundColor: theme.colors.black },
    profileName: { textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 8,
        textShadowColor: theme.colors.black, fontSize: 16, fontWeight: "500", 
        color: theme.colors.white },
    followbutton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
        backgroundColor: theme.colors.blue },

    reactionControls: { position: "absolute", right: 4, bottom: 200, 
        padding: 4 },
    reactionButton: { padding: 6, marginVertical: 4, borderRadius: 10,
        backgroundColor: theme.colors.semitransparent }
})

export default VideoFooter
