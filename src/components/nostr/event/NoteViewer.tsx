import theme from '@/src/theme';
import { View, Image, StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import LinkPreview from './LinkPreview';
import VideoViewer from './VideoViewer';
import { useRef } from 'react';

type Props = { 
    note: string, 
    videoPaused?: boolean, 
    videoFullScreen?: boolean 
}

const NoteViewer = ({ note, videoPaused = true, videoFullScreen = false }: Props) => {
    
    const viewRef = useRef(null)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
   
    const handleUrl = (matchingString: string) => {
        return `\n${matchingString}`; // Adiciona quebra de linha antes do link
    }

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
            return <VideoViewer paused={videoPaused} hideFullscreen={!videoFullScreen} url={url} />
        } else {
            return <LinkPreview link={url} />
        }
    }

    return (
        <View ref={viewRef} style={styles.webview}>
            <ParsedText
                style={styles.text}
                parse={[{ 
                    pattern: urlRegex, 
                    style: styles.link, 
                    renderText: renderText
                }]}
            >
                {
                    note.replaceAll(" https", " \n\rhttps")
                }
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
        width: "98%",
        height: 150,
        marginVertical: 10,
        resizeMode: 'contain',
        borderRadius: 10,
        overflow: "hidden"
    },
    webview: {
        padding: 0,
        overflow: "hidden"
    }
});

export default NoteViewer;

