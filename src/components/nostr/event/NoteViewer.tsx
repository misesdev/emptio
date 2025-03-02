import theme from '@src/theme';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import LinkPreview from './LinkPreview';
import VideoViewer from './VideoViewer';
import ImagePreview from './ImagePreview';
import EventViewer from './EventViewer';
import { NDKEvent } from '@nostr-dev-kit/ndk-mobile';
import Ionicons from "react-native-vector-icons/Ionicons"
import { copyPubkey, getDisplayPubkey, getUserName, replaceContentEvent } from '@src/utils';
import ProfileViewer from './ProfileViewer';
import HashTagViewer from './HashTagViewer';
import { User } from '@services/memory/types';
import { useEffect, useState } from 'react';
import { ProfilePicture } from '../user/ProfilePicture';
import { useAuth } from '@src/providers/userProvider';
import { userService } from '@services/user';

type Props = { 
    author?: User,
    note: NDKEvent, 
    showUser?: boolean,
    videoMuted?: boolean, 
    setMutedVideo?: (mutted: boolean) => void, 
    videoPaused?: boolean, 
    videoFullScreen?: boolean 
}

const NoteViewer = ({ author, showUser=true, note, videoMuted=true, videoPaused=true, videoFullScreen=false, setMutedVideo }: Props) => {
   
    const { user, follows } = useAuth()
    const [eventAuthor, setEventAutor] = useState<User>(author ?? {})
    const hashTagRegex = /#\w+/g
    const seeMoreReex = /<seemore>/g
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const nostrRegex = /(npub|nprofile|nevent|note|naddr)1[023456789acdefghjklmnpqrstuvwxyz]+/g
   
    useEffect(() => { loadUserData() }, [])

    const loadUserData = async () => {
        if(!author && showUser)
        {
            if(note.pubkey == user.pubkey) return setEventAutor(user)

            const author = follows.find(f => f.pubkey == note.pubkey)
            if(author) return setEventAutor(author)

            const userData = await userService.getProfile(note.pubkey ?? "")
            if(userData) setEventAutor(userData)
        }
    }

    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    }

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    }

    const renderText = (matchingString: string, matches: string[]): any => {
        const url = matches[0]
        if (isImageUrl(url)) return <ImagePreview url={url} />
        else if(isVideoUrl(url)) {
            return <VideoViewer 
                muted={videoMuted} 
                setMuted={setMutedVideo}
                paused={videoPaused} 
                hideFullscreen={!videoFullScreen} 
                url={url}
            />
        } else 
            return <LinkPreview link={url} />
    }

    const renderNostr = (matchingString: string, matches: string[]): any => {
        const nostr = matches[0]
        if(nostr.includes("npub")) return <ProfileViewer npub={nostr} />
        else if(nostr.includes("nprofile")) return <ProfileViewer nprofile={nostr} />
        else if(nostr.includes("nevent")) { 
            return <EventViewer nevent={nostr}
                videoMuted={videoMuted} 
                setMutedVideo={setMutedVideo} 
                videoPaused={videoPaused} 
                videoFullScreen={videoFullScreen}
            />
        } 
        else if(nostr.includes("note")) {
            return <EventViewer note={nostr}
                videoMuted={videoMuted} 
                setMutedVideo={setMutedVideo} 
                videoPaused={videoPaused} 
                videoFullScreen={videoFullScreen}  
            />
        } 
        else if(nostr.includes("naddr")) return "@addr"
        return ""
    }
    
    const renderHashTag = (matchingString: string, matches: string[]): any => {
        return <HashTagViewer hashtag={matches[0]} />
    }

    return (
        <View style={styles.webview}>
            { showUser &&
                <View style={styles.header}>
                    <View style={{ width: "10%", justifyContent: "center" }}>
                        <TouchableOpacity>
                            <ProfilePicture withBorder user={eventAuthor} size={34} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "80%", paddingHorizontal: 15 }}>
                        <Text style={styles.profileName}>
                            {getUserName(eventAuthor)}
                        </Text>
                        <TouchableOpacity activeOpacity={.7} 
                            onPress={() => copyPubkey(note.pubkey)}
                            style={{ flexDirection: "row" }}
                        >
                            <Text style={{ color: theme.colors.gray }}>
                                {getDisplayPubkey(note.pubkey, 15)}
                            </Text>
                            <Ionicons name="copy" size={10} style={{ padding: 5 }} color={theme.colors.gray} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "10%" }}>

                    </View>
                </View>
            }
            
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
                    {note.content &&
                        replaceContentEvent(note.content)
                    }
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

export default NoteViewer;

