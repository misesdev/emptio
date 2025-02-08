import HashTagViewer from "@/src/components/nostr/event/HashTagViewer"
import LinkPreview from "@/src/components/nostr/event/LinkPreview"
import ProfileViewer from "@/src/components/nostr/event/ProfileViewer"
import theme from "@/src/theme"
import { replaceContentEvent } from "@/src/utils"
import { useCallback, useEffect, useState } from "react"
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native"
import ParsedText from "react-native-parsed-text"

type Props = { content: string, url: string }

const VideoDescription = ({ content, url }: Props) => {
    const hashTagRegex = /#\w+/g
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const nostrRegex = /(npub|nprofile|nevent|note|naddr)1[023456789acdefghjklmnpqrstuvwxyz]+/g
   
    const [fullcontent, setFullcontent] = useState(false)
    const [contentText, setContentText] = useState("")
    const [contentFullText, setContentFullText] = useState("")

    useEffect(() => {
        const text = content.replace(url,"").trim()
        setContentText(`${text.substring(0, 30).replaceAll("\n"," ")}...`)
        setContentFullText(text)
    },[])

    const handleSetText = useCallback(() => {
        setFullcontent(prev => !prev)
    },[])

    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    }

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    }

    const renderText = (matchingString: string, matches: string[]): any => {
        const url = matches[0]
        if (isImageUrl(url)) {
        } else if(isVideoUrl(url)) {
        } else 
            return <LinkPreview link={url} />
    }

    const renderNostr = (matchingString: string, matches: string[]): any => {
        const nostr = matches[0]
        if(nostr.includes("npub")) return <ProfileViewer npub={nostr} />
        else if(nostr.includes("nprofile")) return <ProfileViewer nprofile={nostr} />
        else if(nostr.includes("naddr")) return "@addr"
        return ""
    }
    
    const renderHashTag = (matchingString: string, matches: string[]): any => {
        return <HashTagViewer hashtag={matches[0]} />
    }

    const TextRenderComponent = ({ text }: { text: string}) => {
        return (
            <ParsedText 
                style={styles.text}
                parse={[{
                    style: styles.link,
                    pattern: nostrRegex,
                    renderText: renderNostr
                }, {
                        style: styles.link,
                        pattern: hashTagRegex,
                        renderText: renderHashTag
                }]}
            >
                {replaceContentEvent(text)}
            </ParsedText>
        )
    }
    
    return (
        <ScrollView style={styles.contentContainer}>
            <TouchableOpacity activeOpacity={.7}
                onPress={handleSetText} style={{ paddingVertical: 10 }}
            >
                <TextRenderComponent text={fullcontent ? contentFullText:contentText} />
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentContainer: { width: "100%", marginBottom: 20, borderRadius: 10, maxHeight: 400, 
        paddingHorizontal: 10, backgroundColor: theme.colors.semitransparent, 
        overflow: "scroll" },
    text: { color: theme.colors.white },
    link: { color: theme.colors.blue, 
        textDecorationLine: 'underline' },
})

export default VideoDescription
