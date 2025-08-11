import { NDKEvent, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native"
import { useEffect, useState } from "react"
import theme from "@src/theme"
import { nip19 } from "nostr-tools"
import ParsedText from "react-native-parsed-text"
import LinkPreview from "./LinkPreview"
import ImagePreview from "./ImagePreview"
import VideoViewer from "./VideoViewer"
import ProfileViewer from "./ProfileViewer"
import HashTagViewer from "./HashTagViewer"
import useNDKStore from "@services/zustand/useNDKStore"
import { User } from "@services/user/types/User"
import { useService } from "@src/providers/ServiceProvider"
import { Utilities } from "@src/utils/Utilities"

interface ScreenProps {
    event?: NDKEvent | null,
    nevent?: string,
    note?: string,
    videoMuted?: boolean, 
    setMutedVideo?: (mutted: boolean) => void, 
    videoPaused?: boolean, 
    videoFullScreen?: boolean 
}

const EventViewer = ({ event, nevent, note, videoMuted=true, videoPaused=true, videoFullScreen=false, setMutedVideo }: ScreenProps) => {

    const { ndk } = useNDKStore()
    const { userService } = useService()
    const [pictureError, setPictureError] = useState(false)
    const [contentEvent, setContentEvent] = useState<NDKEvent>()
    const [eventAuthor, setEventAuthor] = useState<User>({ } as User)
    const hashTagRegex = /#\w+/g
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const nostrRegex = /(npub|nprofile|nevent|note|naddr)1[023456789acdefghjklmnpqrstuvwxyz]+/g
    
    useEffect(() => { loadEventData() }, [])

    const loadEventData = async () => {
        try {
            var author: string = ""
            if(event) { 
                author = event.pubkey
                setContentEvent(event)
            } else if(nevent) {
                const decoded:any = nip19.decode(nevent)
                const nostrEvent = await ndk.fetchEvent(decoded.data.id, {
                    cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
                })
                if(nostrEvent) setContentEvent(nostrEvent)
                author = decoded.data.author ?? ""
            } else if (note) {
                const decoded:any = nip19.decode(note)
                const nostrEvent = await ndk.fetchEvent(decoded.data, {
                    cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
                })
                if(nostrEvent) setContentEvent(nostrEvent)
                author = nostrEvent?.pubkey ?? ""
            }
            if(author.length)
                setEventAuthor(await userService.getUser(author))
        } 
        catch { }
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
        //else if(nostr.includes("nevent")) return <EventViewer nevent={nostr} />
        //else if(nostr.includes("note")) return <EventViewer note={nostr} />
        else if(nostr.includes("naddr")) return "@addr"
        return ""
    }

    const renderHashTag = (matchingString: string, matches: string[]): any => {
        return <HashTagViewer hashtag={matches[0]} />
    }

    if(!contentEvent)
        return ( 
            <View style={[styles.container, { justifyContent: "center", alignItems: "center"}]}>
                <Text style={styles.text}>
                    Nostr event not found
                </Text>
            </View>
        )
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity>
                        {eventAuthor?.picture && <Image onError={() => setPictureError(true)} source={{ uri: eventAuthor?.picture }} style={styles.userProfile} />}
                        {(!eventAuthor?.picture || pictureError) && <Image source={require("@assets/images/defaultProfile.png")} style={styles.userProfile} />}
                    </TouchableOpacity>
                </View>
                <View style={{ width: "70%", paddingHorizontal: 10 }}>
                    <Text style={styles.profileName}>
                        {Utilities.getUserName(eventAuthor)}
                    </Text>
                </View>
                <View style={{ width: "15%" }}>

                </View>
            </View>
            <View style={styles.content}>
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
                    {contentEvent.content &&
                        Utilities.replaceContentEvent(contentEvent.content)
                    }
                </ParsedText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", padding: 10, borderRadius: theme.design.borderRadius,
        borderWidth: 1, borderColor: theme.colors.blue },
    header: { width: "100%", flexDirection: "row" },
    userProfile: { width: theme.icons.extra, height: theme.icons.extra, borderRadius: 50 },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white },
    content: { width: "100%", padding: 10 },
    text: { color: theme.colors.gray },
    link: { color: theme.colors.blue, textDecorationLine: 'underline' }
})

export default EventViewer
