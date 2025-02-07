import HashTagViewer from "@/src/components/nostr/event/HashTagViewer"
import LinkPreview from "@/src/components/nostr/event/LinkPreview"
import ProfileViewer from "@/src/components/nostr/event/ProfileViewer"
import theme from "@/src/theme"
import { replaceContentEvent } from "@/src/utils"
import { useEffect, useState } from "react"
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
        setContentFullText(text)
        setContentText(`${text.substring(0, 30).replace("\n","")}...`)
    },[])

    const handleSetText = () => {
        console.log("handle Set text")
        setFullcontent(prev => !prev)
    }

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
        <TouchableOpacity activeOpacity={.7} 
            style={{ width: "100%" }}
            onPress={handleSetText} 
        >       
            <View style={{ flex: 1 }}>
                <ScrollView pointerEvents="box-none" 
                    style={styles.contentContainer}>
                    {fullcontent && <TextRenderComponent text={contentFullText} />}
                    {!fullcontent && <TextRenderComponent text={contentText} />}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contentContainer: { flex: 1, borderRadius: 10, marginBottom: 4, maxHeight: 400, 
        padding: 10, backgroundColor: theme.colors.semitransparent },
    text: { color: theme.colors.white },
    link: { color: theme.colors.blue, textDecorationLine: 'underline' },
})

export default VideoDescription
