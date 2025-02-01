import { Video, VideoRef } from 'react-native-video';
import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Linking } from 'react-native';
import theme from '@/src/theme';
import { ButtonLink } from '../../form/Buttons';

type VideoProps = { 
    url: string,
    paused?: boolean,
    muted?: boolean,
    hideFullscreen: boolean
}

const VideoViewer = ({ url, hideFullscreen = false, muted=false, paused=true }: VideoProps) => {

    const videoRef = useRef<VideoRef>(null)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        if(videoRef.current) 
        {
            if(paused) videoRef.current.pause()
            else videoRef.current.resume()
        }
    }, [paused])

    useEffect(() => {
        if(videoRef.current) 
        {
            if(muted) videoRef.current.setVolume(0)
            else videoRef.current.setVolume(100)
        }
    }, [muted])

    if(error) 
        return (
            <View style={{ position: "relative", width: "100%", padding: 10 }}>
                <ButtonLink 
                    label={url} 
                    style={{ marginVertical: 0 }}
                    color={theme.colors.blue} 
                    onPress={() => Linking.openURL(url)}
                />
            </View>
        )
        
    return (
        <View style={styles.contentVideo}>
            <Video onError={() => setError(true)} ref={videoRef} controls repeat paused={paused} muted={muted}
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
                resizeMode="cover"
                removeClippedSubviews
                renderToHardwareTextureAndroid
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contentVideo: {
        width: "98%",
        height: 320,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: theme.colors.black
    },
    video: {
        flex: 1,
        borderRadius: 10
    }
})

export default VideoViewer
