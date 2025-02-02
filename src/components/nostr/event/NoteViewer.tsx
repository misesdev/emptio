import theme from '@/src/theme';
import { View, StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import LinkPreview from './LinkPreview';
import VideoViewer from './VideoViewer';
import { useRef } from 'react';
import ImagePreview from './ImagePreview';

type Props = { 
    note: string, 
    videoMuted?: boolean, 
    setMutedVideo?: (mutted: boolean) => void, 
    videoPaused?: boolean, 
    videoFullScreen?: boolean 
}

const NoteViewer = ({ note, videoMuted=true, videoPaused=true, videoFullScreen=false, setMutedVideo }: Props) => {
    
    const viewRef = useRef(null)
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
            return <ImagePreview url={url} />
        } 
        else if(isVideoUrl(url)) {
            return <VideoViewer 
                muted={videoMuted} 
                setMuted={setMutedVideo}
                paused={videoPaused} 
                hideFullscreen={!videoFullScreen} 
                url={url}
            />
        } 
        else {
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
    webview: {
        padding: 0,
        overflow: "hidden"
    }
});

export default NoteViewer;

