import { Video, VideoRef } from 'react-native-video'
import { useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import { useTranslateService } from '@/src/providers/translateProvider'
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile'
import { ActivityIndicator } from 'react-native-paper'
import VideoFooter from './commons/footer'
import theme from '@/src/theme'

type VideoProps = { 
    url: string,
    event: NDKEvent,
    paused: boolean,
    muted: boolean,
    setMuted: (state: boolean) => void
}

const FeedVideoViewer = ({ event, url, paused, muted, setMuted }: VideoProps) => {

    const timeout: any = useRef(null)
    const { width, height } = Dimensions.get("window")
    const videoRef = useRef<VideoRef>(null)
    const { useTranslate } = useTranslateService()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [mutedVideo, setMutedVideo] = useState<boolean>(muted)
    const [showMuted, setShowMuted] = useState<boolean>(false)

    const onLoadVideo = (data: any) => {
        setLoading(false)
        if(data?.duration) setDuration(data.duration)
    }

    const onProgressVideo = (data: any) => {
        if(data?.currentTime) setCurrentTime(data.currentTime)
    }

    const handleMute = () => {
        setShowMuted(true)
        setMutedVideo(prev => !prev)
        setMuted(!muted)
        if(timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            setShowMuted(false)
        }, 1000)
    }

    const handleSeek = (time: number) => {
        if(videoRef.current) {
            videoRef.current.seek(time)
            setCurrentTime(time)
        }
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
            />
            <TouchableOpacity activeOpacity={1} onPress={handleMute}
                style={styles.controlsContainer}
            >
                {loading && 
                    <ActivityIndicator size={28} color={theme.colors.white} />
                }
                {error && 
                    <Text style={{ color: theme.colors.white }}>
                        {useTranslate("message.default_error")} 
                    </Text>
                }
                
                {showMuted && !loading &&
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
                        maximumValue={duration}
                        value={currentTime}
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
