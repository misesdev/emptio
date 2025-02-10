import { Video, VideoRef } from 'react-native-video';
import { useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import { downloadFile, ExternalDirectoryPath } from 'react-native-fs'
import { getGaleryPermission } from '@/src/services/permissions'
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import theme from '@/src/theme';
import { pushMessage } from '@/src/services/notification';
import { useTranslateService } from '@/src/providers/translateProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile';
import { ActivityIndicator } from 'react-native-paper';
import VideoFooter from './commons/footer';
import VideoPostOptions from './commons/options';
import VideoHeader from './commons/header';

type VideoProps = { 
    url: string,
    event: NDKEvent,
    paused: boolean,
}

const FeedVideoViewer = ({ event, url, paused }: VideoProps) => {

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
    const [optionsVisible, setOptionsVisible] = useState<boolean>(false)

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
            />
            <TouchableOpacity activeOpacity={1} onPress={handleMute}
                style={styles.controlsContainer}
            >
                <VideoHeader 
                    downloading={downloading} 
                    handleDownload={handleDownload}
                    handleManageFilters={() => setOptionsVisible(true)}
                /> 

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

                {downloading &&
                    <View style={{ alignItems: "center", minWidth: 100, padding: 5, borderRadius: 10, backgroundColor: theme.colors.blueOpacity }}>
                        <Ionicons name={"cloud-download"} size={18} color={theme.colors.white} />
                        <Text style={{ fontSize: 16, color: theme.colors.white }}>
                            {downloadProgress.toFixed(0)}%
                        </Text>
                    </View>
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
            <VideoPostOptions visible={optionsVisible} setVisible={setOptionsVisible} />
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
