import theme from '@/src/theme';
import { View, Image, StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { Video, VideoRef } from 'react-native-video';
import LinkPreview from './LinkPreview';
import { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type VideoProps = { 
    url: string,
    hideFullscreen: boolean
}

const VideoScreen = ({ url, hideFullscreen = false }: VideoProps) => {

    const videoRef = useRef<VideoRef>(null)

    useFocusEffect(() => {
        useCallback(() => {
            return () => {
                if(videoRef.current) videoRef.current?.pause()
            }
        }, [])
    })

    return (
        <View style={styles.contentVideo}>
            <Video ref={videoRef} controls repeat paused 
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
                
                resizeMode="contain"
            />
        </View>
    )
}

type Props = { note: string, videoFullScreen?: boolean }

const NoteViewer = ({ note, videoFullScreen = false }: Props) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    }

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    }

    const renderText = (matchingString: string, matches: string[]) => {
        const url = matches[0];
        if (isImageUrl(url)) {
            return (
                <View style={styles.image}>
                    <Image source={{ uri: url }} style={{ flex: 1 }} />
                </View>
            )
        } else if(isVideoUrl(url)) {
            return <VideoScreen hideFullscreen={!videoFullScreen} url={url} />
        } else {
            return <LinkPreview link={url} />
        }
    }

    return (
        <View style={styles.webview}>
            <ParsedText
                style={styles.text}
                parse={[{ 
                    pattern: urlRegex, 
                    style: styles.link, 
                    renderText: renderText 
                }]}
            >
                {note}
            </ParsedText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        color: theme.colors.gray,
    },
    link: {
        color: theme.colors.blue,
        textDecorationLine: 'underline',
    },
    image: {
        width: "100%",
        height: 150,
        margin: 10,
        resizeMode: 'contain',
        borderRadius: 10,
        overflow: "hidden"
    },
    webview: {
        padding: 0,
        overflow: "hidden"
    },
    contentVideo: {
        width: "100%",
        height: 320,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: theme.colors.black
    },
    video: {
        flex: 1,
        borderRadius: 10
    }
});

export default NoteViewer;

