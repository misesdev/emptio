import theme from '@src/theme';
import { View, StyleSheet } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import LinkPreview from './LinkPreview';
import ImagePreview from './ImagePreview';
import EventViewer from './EventViewer';
import ProfileViewer from './ProfileViewer';
import HashTagViewer from './HashTagViewer';
import VideoViewer from './VideoViewer';
import { replaceContentEvent } from '@src/utils';

interface Props { 
    content: string 
}

const ContentViewer = ({ content }: Props) => {
   
    const hashTagRegex = /#\w+/g
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const nostrRegex = /(npub|nprofile|nevent|note|naddr)1[023456789acdefghjklmnpqrstuvwxyz]+/g
   
    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    }

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    }

    const renderText = (matchingString: string, matches: string[]): any => {
        const url = matches[0]
        if (isImageUrl(url)) return <ImagePreview url={url} />
        else if(isVideoUrl(url)) return <VideoViewer url={url} hideFullscreen/>
        else return <LinkPreview link={url} />
    }

    const renderNostr = (matchingString: string, matches: string[]): any => {
        const nostr = matches[0]
        if(nostr.includes("npub")) return <ProfileViewer npub={nostr} />
        else if(nostr.includes("nprofile")) return <ProfileViewer nprofile={nostr} />
        else if(nostr.includes("nevent")) return <EventViewer nevent={nostr}/>
        else if(nostr.includes("note")) return <EventViewer note={nostr} />
        else if(nostr.includes("naddr")) return "@addr"
        return ""
    }
    
    const renderHashTag = (matchingString: string, matches: string[]): any => {
        return <HashTagViewer hashtag={matches[0]} />
    }

    return (
        <View style={styles.webview}>
            <View style={{ width: "100%", padding: 5 }}>
                <ParsedText
                    style={styles.text}
                    parse={[{ 
                        pattern: urlRegex, 
                        style: styles.link, 
                        renderText: renderText
                    }, {
                        style: styles.link,
                        pattern: nostrRegex,
                        renderText: renderNostr
                    }, {
                            style: styles.link,
                            pattern: hashTagRegex,
                            renderText: renderHashTag
                    }]}
                >
                    {replaceContentEvent(content)}
                </ParsedText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    text: { color: theme.colors.gray },
    link: { color: theme.colors.blue, textDecorationLine: 'underline' },
    webview: { padding: 0, overflow: "hidden" },
    header: { width: "100%", flexDirection: "row", paddingVertical: 4 },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white },
});

export default ContentViewer;

