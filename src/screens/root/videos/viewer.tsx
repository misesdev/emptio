import { Video, VideoRef } from 'react-native-video'
import { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import { useTranslateService } from '@/src/providers/translateProvider'
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile'
import VideoFooter from './commons/footer'
import theme from '@/src/theme'
import { extractVideoUrl } from '@/src/utils'
import { ActivityIndicator } from 'react-native-paper'

type VideoProps = { 
    event: NDKEvent,
    paused: boolean
}

const FeedVideoViewer = ({ event, paused }: VideoProps) => {

    const url = extractVideoUrl(event.content) ?? ""
    const timeout: any = useRef(null)
    const { useTranslate } = useTranslateService()
    const { width, height } = Dimensions.get("window")
    const videoRef = useRef<VideoRef>(null)
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [error, setError] = useState<boolean>(false)
    const [mutedVideo, setMutedVideo] = useState<boolean>(false)
    const [showMuted, setShowMuted] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const onLoadVideo = (data: any) => {
        setDuration(data?.duration||0)
        setLoading(false)
    }

    const onProgressVideo = (data: any) => {
        setCurrentTime(data?.currentTime||0)
    }

    const handleMute = () => {
        setShowMuted(true)
        setMutedVideo(prev => !prev)
        if(timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            setShowMuted(false)
        }, 1000)
    }

    const handleSeek = useCallback((time: number) => {
        if(videoRef.current) {
            videoRef.current.seek(time)
            setCurrentTime(time)
        }
    }, [videoRef, setCurrentTime])

    return (
        <View style={[styles.contentVideo, { width: width, height: height }]}>
            <Video onError={() => setError(true)} 
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
                delayLongPress={100} style={styles.controlsContainer}
            >
                {error && 
                    <Text style={{ color: theme.colors.white }}>
                        {useTranslate("message.default_error")} 
                    </Text>
                }
                {loading && 
                    <ActivityIndicator size={20} color={theme.colors.white} />
                }
                {showMuted && 
                    <TouchableOpacity onPress={handleMute} style={styles.mutedIndicator}>
                        <Ionicons size={34} color={theme.colors.white}
                            name={mutedVideo ? "volume-mute":"volume-high"}
                        />
                    </TouchableOpacity>
                }

                <VideoFooter event={event} url={url} /> 
                <View style={styles.controlsSliderContainer}>
                    <Slider
                        style={styles.controlsSlider}
                        minimumValue={0}
                        value={currentTime}
                        maximumValue={duration}
                        onSlidingComplete={handleSeek} 
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
    contentVideo: { flex: 1, backgroundColor: theme.colors.black },
    video: { flex: 1, backgroundColor: theme.colors.black },
    mutedIndicator: { padding: 10, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },
    controlsContainer: { position: "absolute", width: "100%", height: "100%", 
        alignItems: "center", justifyContent: "center" },
    controlsHeader: { position: "absolute", top: 0, padding: 10, width: "100%",
        paddingTop: 30, flexDirection: "row-reverse" },
    controlsHeaderButton: { padding: 4, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
    controlsSliderContainer: { width: "100%", position: "absolute", paddingVertical: 2, 
        borderRadius: 5, bottom: 22 },
    controlsSlider: { width: "100%" },
})

export default FeedVideoViewer
