import HashTagViewer from "@components/nostr/event/HashTagViewer"
import LinkPreview from "@components/nostr/event/LinkPreview"
import ProfileViewer from "@components/nostr/event/ProfileViewer"
import ImagePreview from "@components/nostr/event/ImagePreview"
import { replaceContentEvent } from "@src/utils"
import { memo, useCallback, useEffect, useState } from "react"
import { StyleSheet, ScrollView, Text } from "react-native"
import ParsedText from "react-native-parsed-text"
import { useTranslateService } from "@src/providers/translateProvider"
import theme from "@src/theme"

type Props = { content: string, url: string }

const VideoDescription = ({ content, url }: Props) => {
    const seeMoreRegex = /<seemore>/g
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const hashTagRegex = /#([\wáéíóúãõâêîôûäëïöüçñÀ-ÿ0-9_]+)/g
    const nostrRegex = /(npub|nprofile|nevent|note|naddr)1[023456789acdefghjklmnpqrstuvwxyz]+/g
   
    const { useTranslate } = useTranslateService()
    const [fullcontent, setFullcontent] = useState(false)
    const [contentText, setContentText] = useState("")
    const [contentFullText, setContentFullText] = useState("")

    useEffect(() => {
        const text = content.replace(url,"").trim()
        if(text.length <= 30) return setContentText(text)
        setContentText(`${text.substring(0, 30).replaceAll("\n"," ")} ..<seemore>`)
        setContentFullText(`${text} ..<seemore>\n `)
    },[])

    const handleSetText = useCallback(() => {
        setFullcontent(prev => !prev)
    }, [setFullcontent])

    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    }

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    }

    const renderLink = (matchingString: string, matches: string[]): any => {
        const url = matches[0]
        if (isImageUrl(url)) return <ImagePreview url={url} />
        // } else if(isVideoUrl(url)) {
        // } else 
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

    const renderSeeButton = (matchingString: string, matches: string[]): any => {
        return (
            <Text onPress={handleSetText} style={styles.expandbutton}>
                {fullcontent ? useTranslate("commons.seeless") : useTranslate("commons.seemore")}
            </Text>
        )
    }

    const TextRenderComponent = ({ text }: { text: string}) => {
        return (
            <ParsedText 
                style={[styles.text, styles.shadow]}
                parse={[{
                    style: styles.link,
                    pattern: nostrRegex,
                    renderText: renderNostr
                }, {
                    style: styles.link,
                    pattern: hashTagRegex,
                    renderText: renderHashTag
                }, {
                    style: styles.link,
                    pattern: urlRegex,
                    renderText: renderLink
                }, {
                    style: styles.link,
                    pattern: seeMoreRegex,
                    renderText: renderSeeButton
                }]}
            >
                {replaceContentEvent(text)} 
            </ParsedText>
        )
    }
    
    return (
        <ScrollView nestedScrollEnabled style={styles.contentContainer}>
            <TextRenderComponent text={fullcontent ? contentFullText:contentText} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentContainer: { flex: 1, marginBottom: 20, maxHeight: 230, 
        paddingHorizontal: 10, zIndex: 999 },
    shadow: { textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6, 
        textShadowColor: theme.colors.semitransparentdark },
    text: { color: theme.colors.white, paddingVertical: 8 },
    link: { color: theme.colors.blue, textDecorationLine: 'underline' },
    expandbutton: { color: theme.colors.white, fontWeight: "500", 
        textDecorationLine: "none" }
})

export default memo(VideoDescription)
