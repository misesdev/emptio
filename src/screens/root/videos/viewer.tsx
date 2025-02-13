import { Video, VideoRef } from 'react-native-video'
import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import { useTranslateService } from '@/src/providers/translateProvider'
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile'
import VideoFooter from './commons/footer'
import theme from '@/src/theme'

type VideoProps = { 
    url: string,
    event: NDKEvent,
    paused: boolean
}

const FeedVideoViewer = ({ event, url, paused }: VideoProps) => {

    const timeout: any = useRef(null)
    const pausedVideo = useRef<boolean>(paused)
    const { width, height } = Dimensions.get("window")
    const videoRef = useRef<VideoRef>(null)
    const duration = useRef<number>(0)
    const currentTime = useRef<number>(0)
    const { useTranslate } = useTranslateService()
    const [error, setError] = useState<boolean>(false)
    const [mutedVideo, setMutedVideo] = useState<boolean>(false)
    const [showMuted, setShowMuted] = useState<boolean>(false)

    useEffect(() => { pausedVideo.current = paused }, [paused])

    const onLoadVideo = (data: any) => {
        if(data?.duration) duration.current = data.duration
    }

    const onProgressVideo = (data: any) => {
        if(data?.currentTime) currentTime.current = data.currentTime
    }

    const handleMute = () => {
        setShowMuted(true)
        setMutedVideo(prev => !prev)
        if(timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            setShowMuted(false)
        }, 1000)
    }

    const handleSeek = (time: number) => {
        if(videoRef.current) {
            videoRef.current.seek(time)
            currentTime.current = time
        }
    }

    const handleScreenShot = (state: boolean) => {
        pausedVideo.current = state
    }

    return (
        <View style={[styles.contentVideo, { width: width, height: height }]}>
            <Video onError={() => setError(true)} 
                ref={videoRef} repeat paused={pausedVideo.current} muted={mutedVideo}
                //playInBackground={false}
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
            />
            <TouchableOpacity activeOpacity={1} onPress={handleMute}
                onLongPress={() => handleScreenShot(true)} 
                onPressOut={() => handleScreenShot(false)}
                style={styles.controlsContainer}
            >
                {error && 
                    <Text style={{ color: theme.colors.white }}>
                        {useTranslate("message.default_error")} 
                    </Text>
                }
                
                {showMuted && 
                    <TouchableOpacity onPress={handleMute}
                        style={{ padding: 10, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}
                    >
                        <Ionicons name={mutedVideo ? "volume-mute":"volume-high"} size={34} color={theme.colors.white} />
                    </TouchableOpacity>
                }

                <VideoFooter event={event} url={url} /> 
                <View style={styles.controlsSliderContainer}>
                    <Slider
                        style={styles.controlsSlider}
                        minimumValue={0}
                        maximumValue={duration.current}
                        value={currentTime.current}
                        onSlidingComplete={handleSeek} // Busca no vídeo quando soltar o slider
                        minimumTrackTintColor={theme.colors.white}
                        maximumTrackTintColor={theme.colors.white}
                        thumbTintColor={theme.colors.white}
                    />
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
    controlsSliderContainer: { width: "100%", position: "absolute", paddingVertical: 2, 
        borderRadius: 5, bottom: 22 },
    controlsSlider: { width: "100%" },

    profilebar: { width: "100%", paddingVertical: 6, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden",
        backgroundColor: theme.colors.black },
    profileName: { textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 8,
        textShadowColor: theme.colors.black, fontSize: 16, fontWeight: "500", 
        color: theme.colors.white },
})

export default FeedVideoViewer
