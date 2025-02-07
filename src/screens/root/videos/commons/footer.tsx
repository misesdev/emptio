import { userService } from "@src/core/userManager"
import { User } from "@services/memory/types"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { copyPubkey, getDisplayPubkey, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState } from "react"
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"
import VideoDescription from "./description"
import { Slider } from "react-native-elements"
import theme from "@src/theme"

type Props = { 
    event: NDKEvent, 
    url: string,
    duration?: number,
    currentTime?: number,
    handleSeek?: (time: number) => void,
    navigation: any
}

const VideoFooter = ({ event, url, duration, currentTime, handleSeek, navigation }: Props) => {

    const [profile, setProfile] = useState<User>({})
    const [profileError, setProfileError] = useState<boolean>(false)
    
    useEffect(() => {
        userService.getProfile(event.pubkey).then(setProfile)
    }, [event.pubkey])

    return (
        <View style={styles.controlsSliderContainer}>
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
                <View style={{ width: "25%", padding: 10, flexDirection: "row-reverse" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("feed-video-options")}>
                        <Ionicons style={{ padding: 4 }} name="ellipsis-vertical" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <VideoDescription content={event.content} url={url} />
            <View style={{ width: "100%" }}>
                {/* <Slider */}
                {/*     style={styles.controlsSlider} */}
                {/*     minimumValue={0} */}
                {/*     maximumValue={duration} */}
                {/*     value={currentTime} */}
                {/*     onSlidingComplete={handleSeek} // Busca no vídeo quando soltar o slider */}
                {/*     minimumTrackTintColor={theme.colors.white} */}
                {/*     maximumTrackTintColor={theme.colors.white} */}
                {/*     thumbTintColor={theme.colors.white} */}
                {/* /> */}
            </View>
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

})

export default VideoFooter
