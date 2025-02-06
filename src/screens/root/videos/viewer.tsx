import { Video, VideoRef } from 'react-native-video';
import { useCallback, useEffect, useRef, useState } from "react"
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import { downloadFile, ExternalDirectoryPath } from 'react-native-fs'
import { getGaleryPermission } from '@/src/services/permissions'
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import theme from '@/src/theme';
import { pushMessage } from '@/src/services/notification';
import { useTranslateService } from '@/src/providers/translateProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile';
import { User } from '@/src/services/memory/types';
import { userService } from '@/src/core/userManager';
import { copyPubkey, getDisplayPubkey, getUserName } from '@/src/utils';
import { ActivityIndicator } from 'react-native-paper';

type VideoProps = { 
    url: string,
    event: NDKEvent,
    paused?: boolean,
    muted?: boolean,
    setMuted?: (mutted: boolean) => void,
}

const FeedVideoViewer = ({ event, url, muted=false, paused=false, setMuted }: VideoProps) => {

    const timeout: any = useRef(null)
    const { width, height } = Dimensions.get("window")
    const videoRef = useRef<VideoRef>(null)
    const { useTranslate } = useTranslateService()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [mutedVideo, setMutedVideo] = useState<boolean>(false)
    const [showMuted, setShowMuted] = useState<boolean>(false)
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [profileError, setProfileError] = useState<boolean>(false)
    const [profile, setProfile] = useState<User>({})

    useEffect(() => {
        userService.getProfile(event.pubkey).then(setProfile)
    }, [event.pubkey])

    useEffect(() => { 
        if(muted != mutedVideo) setMutedVideo(muted)
    }, [muted])

    const onLoadVideo = (data: any) => {
        setLoading(false)
        if(data?.duration) setDuration(data.duration)
    }

    const onProgressVideo = (data: any) => {
        if(data?.currentTime) setCurrentTime(data.currentTime)
    }

    const handleMute = useCallback(() => {
        setShowMuted(true)
        setMutedVideo(prev => !prev)
        if(setMuted) setMuted(!muted)
        
        if(timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            setShowMuted(false)
        }, 1000)
    },[])

    const handleSeek = useCallback((time: number) => {
        if(videoRef.current) {
            videoRef.current.seek(time)
            setCurrentTime(time)
        }
    }, [])

    const handleDownload = async() => {

        if(!(await getGaleryPermission())) return

        setDownloading(true)
        setDownloadProgress(0)

        const filePath = `${ExternalDirectoryPath}${url.substring(url.lastIndexOf("/"))}`
        await downloadFile({
            fromUrl: url,
            toFile: filePath,
            progress: (res) => {
                let percentage = (res.bytesWritten / res.contentLength) * 100
                setDownloadProgress(percentage)
            }
        }).promise.then(() => {
            setDownloading(false)
            setDownloadProgress(0)
            CameraRoll.saveAsset(filePath, { type: "video" })
            pushMessage(useTranslate("message.download.successfully"))
        }).catch(() => { 
            setDownloading(false)
            setDownloadProgress(0)
        })
    }

    const handleError = () => {
        setError(true)
        setLoading(false)
    }

    return (
        <View style={[styles.contentVideo, { width: width, height: height }]}>
            <Video onError={handleError} 
                ref={videoRef} repeat paused={paused} muted={mutedVideo}
                playInBackground={false}
                fullscreenOrientation='portrait'
                controlsStyles={{ 
                    hideNext: true, 
                    hideForward: true,
                    hidePrevious: true,
                    hideRewind: true, 
                    hideFullscreen: true
                }}                
                source={{ uri: url }}                
                style={styles.video}
                resizeMode="contain"
                onLoad={onLoadVideo}
                onProgress={onProgressVideo}
                disableFocus
            >
            </Video>
            <TouchableOpacity activeOpacity={1} onPress={handleMute}
                style={styles.controlsContainer}
            >
                <View style={styles.controlsHeader}>
                    {!downloading &&
                        <TouchableOpacity style={styles.controlsHeaderButton}
                            onPress={handleDownload}
                        >
                            <Ionicons 
                                name={"cloud-download"} 
                                size={24} color={theme.colors.white} />
                        </TouchableOpacity>
                    }
                </View>

                {loading && 
                    <ActivityIndicator size={28} color={theme.colors.white} />
                }
                {error && 
                    <Text style={{ color: theme.colors.white }}>
                        No content found
                    </Text>
                }
                
                {showMuted && !loading &&
                    <TouchableOpacity onPress={handleMute}
                        style={{ padding: 10, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}
                    >
                        <Ionicons name={mutedVideo ? "volume-mute":"volume-high"} size={34} color={theme.colors.white} />
                    </TouchableOpacity>
                }

                {downloading &&
                    <View style={{ alignItems: "center", minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}>
                        <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} />
                        <Text style={{ fontSize: 16, color: theme.colors.white }}>
                            {downloadProgress}%
                        </Text>
                    </View>
                }
               
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
                            <TouchableOpacity>
                                <Ionicons style={{ padding: 4 }} name="ellipsis-vertical" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: "100%" }}>
                        <Slider
                            style={styles.controlsSlider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={currentTime}
                            onSlidingComplete={handleSeek} // Busca no vídeo quando soltar o slider
                            minimumTrackTintColor={theme.colors.white}
                            maximumTrackTintColor={theme.colors.white}
                            thumbTintColor={theme.colors.white}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    contentVideo: { flex: 1, overflow: "hidden",  backgroundColor: theme.colors.black },
    video: { flex: 1, backgroundColor: theme.colors.black },
    controlsContainer: { position: "absolute", width: "100%", height: "100%", 
        alignItems: "center", justifyContent: "center" },
    controlsHeader: { position: "absolute", top: 0, padding: 10, width: "100%",
        paddingTop: 30, flexDirection: "row-reverse" },
    controlsHeaderButton: { padding: 4, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
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

export default FeedVideoViewer
