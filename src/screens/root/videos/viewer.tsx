import { Video } from 'react-native-video'
import { View, StyleSheet, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import { useTranslateService } from '@src/providers/translateProvider'
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile'
import { ActivityIndicator } from 'react-native-paper'
import VideoFooter from './commons/footer'
import { useVideoViewer } from './hooks/use-video-viewer'
import theme from '@src/theme'

interface VideoProps { 
    event: NDKEvent,
    paused: boolean
}

const FeedVideoViewer = ({ event, paused }: VideoProps) => {

    const { useTranslate } = useTranslateService()
    const {
        url, width, height, loading, videoRef, duration, currentTime, error, 
        setError, onLoadVideo, onProgressVideo, handleSeek
    } = useVideoViewer(event)
 
    return (
        <View style={[styles.contentVideo, { width: width, height: height }]}>
            <Video onError={() => setError(true)} 
                ref={videoRef} repeat paused={paused} 
                source={{ uri: url }}                
                style={styles.video}
                resizeMode="none"
                onLoad={onLoadVideo}
                onProgress={onProgressVideo}
                playInBackground={false}
            />
            <View style={styles.controlsContainer}>
                {error && 
                    <Text style={styles.shadow}>
                        {useTranslate("message.default_error")} 
                    </Text>
                }
                {loading && !error && 
                    <View style={{ paddingTop: 100 }}>
                        <ActivityIndicator size={20} color={theme.colors.white} />
                    </View>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contentVideo: { flex: 1, borderRadius: 10, backgroundColor: theme.colors.black },
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

    shadow: { color: theme.colors.white, textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6, textShadowColor: theme.colors.semitransparentdark, }
})

export default FeedVideoViewer
