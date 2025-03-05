import { Video, VideoRef } from 'react-native-video';
import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import { blobService } from '@/src/services/blob';
import theme from '@src/theme';
import LinkError from './LinkError';

type VideoProps = { 
    url: string,
    paused?: boolean,
    muted?: boolean,
    redute?: number,
    setMuted?: (mutted: boolean) => void,
    hideFullscreen: boolean,
    fullScreen?: boolean
}

const VideoViewer = ({ url, redute=180, fullScreen=false, hideFullscreen=false, muted=false, paused=true, setMuted }: VideoProps) => {

    const { width, height } = Dimensions.get("window")
    const timeoutRef:any = useRef(null)
    const videoRef = useRef<VideoRef>(null)
    const [error, setError] = useState<boolean>(false)
    const [videoHeight, setVideoHeight] = useState<number>(300)
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [mutedVideo, setMutedVideo] = useState<boolean>(muted)
    const [pausedVideo, setPausedVideo] = useState<boolean>(paused)
    const [showControls, setShowControls] = useState<boolean>(false)
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)

    useEffect(() => setMutedVideo(muted), [muted])
    useEffect(() => setPausedVideo(paused), [paused])
    
    const showUpControls = () => {
        setShowControls(true)
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setShowControls(false), 3000)
    }

    const onLoadVideo = (data: any) => {
        if(data?.duration) setDuration(data.duration)
        if(!fullScreen) {
            if(data?.naturalSize?.height && data?.naturalSize.width) {
                setVideoHeight(((width-redute) * data.naturalSize.height) / data.naturalSize.width)
            }
        }
    }

    const onProgressVideo = (data: any) => {
        if(data?.currentTime) setCurrentTime(data.currentTime)
    }

    const handleMute = () => {
        setMutedVideo(!mutedVideo)
        if(setMuted) setMuted(!mutedVideo)
    }

    const handleSeek = (time: number) => {
        if(videoRef.current) videoRef.current.seek(time)
        setCurrentTime(time)
    }

    const handleDownload = async () => {
        if(url) {
            blobService.downloadVideo({ 
                url, 
                setDownloading, 
                setDownloadProgress 
            })
        }
    }

    if(error && !fullScreen) 
        return <LinkError url={url} /> 
    if(error && fullScreen)
        return <></>

    return (
        <View style={[styles.contentVideo, { 
            height: fullScreen ? height-redute : videoHeight, 
        }]}>
            <Video onError={() => setError(true)}                
                ref={videoRef} repeat paused={pausedVideo} muted={mutedVideo}
                playInBackground={false}
                fullscreenOrientation='portrait'
                controlsStyles={{ 
                    hideNext: true, 
                    hideForward: true,
                    hidePrevious: true,
                    hideRewind: true, 
                    hideFullscreen
                }}
                source={{ uri: url }}                
                style={styles.video}
                resizeMode={fullScreen?"cover":"contain"}
                onLoad={onLoadVideo}
                onProgress={onProgressVideo}
                disableFocus
                removeClippedSubviews
                renderLoader
            >
            </Video>
            <TouchableOpacity activeOpacity={1} onPress={showUpControls}
                style={[styles.controlsContainer, {
                    backgroundColor: (showControls || pausedVideo) ? 
                        theme.colors.semitransparent : theme.colors.transparent 
                }]}
            >
                <View style={fullScreen ? styles.controlsHeaderFull : styles.controlsHeader}>
                    <TouchableOpacity style={styles.controlsHeaderButton}
                        onPress={handleMute}
                    >
                        <Ionicons 
                            name={mutedVideo ? "volume-mute":"volume-high"} 
                            size={fullScreen ? 24 : 18} color={theme.colors.white} />
                    </TouchableOpacity>
                    {!downloading &&
                        <TouchableOpacity style={styles.controlsHeaderButton}
                            onPress={handleDownload}
                        >
                            <Ionicons 
                                name={"cloud-download"} 
                                size={fullScreen ? 24 : 18} color={theme.colors.white} />
                        </TouchableOpacity>
                    }
                </View>

                {(showControls || pausedVideo) && !downloading &&
                    <TouchableOpacity onPress={() => setPausedVideo(!pausedVideo)}
                        style={{ padding: 10, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}
                    >
                        <Ionicons name={pausedVideo ? "play":"pause"} size={34} color={theme.colors.white} />
                    </TouchableOpacity>
                }

                {downloading &&
                    <View style={{ alignItems: "center", minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}>
                        <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} />
                        <Text style={{ fontSize: 16, color: theme.colors.white }}>
                            {downloadProgress.toFixed(0)}%
                        </Text>
                    </View>
                }
                
                {showControls &&
                    <View style={fullScreen ? styles.controlsSliderContainerFull : styles.controlsSliderContainer}>
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
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    contentVideo: {
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: theme.colors.black
    },
    video: { flex: 1, borderRadius: 10, backgroundColor: theme.colors.blueOpacity },
    controlsContainer: { 
        position: "absolute", width: "100%", height: "100%", alignItems: "center", 
        justifyContent: "center" },
    controlsHeader: { position: "absolute", top: 0, width: "100%", flexDirection: "row-reverse" },
    controlsHeaderFull: { position: "absolute", top: 0, padding: 10, width: "100%",
        paddingTop: 30, flexDirection: "row-reverse" },
    controlsHeaderButton: { padding: 4, borderRadius: 10, margin: 4,
        backgroundColor: theme.colors.blueOpacity },
    controlsSliderContainer: { width: "90%", position: "absolute", padding: 1, 
        borderRadius: 5, bottom: 5 },
    controlsSliderContainerFull: { width: "90%", position: "absolute", padding: 1, 
        borderRadius: 5, bottom: 45 },
    controlsSlider: { width: "100%" }
})

export default VideoViewer
