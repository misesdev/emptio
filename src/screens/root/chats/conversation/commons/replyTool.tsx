import { messageService } from "@/src/core/messageManager"
import { useTranslateService } from "@/src/providers/translateProvider"
import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { getClipedContent, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

interface ReplyToolProps {
    event: NDKEvent
    messages: NDKEvent[],
    user: User,
    follow: User,
    focusReply: (index: number) => void
}

const ReplyTool = ({ event, messages, user, follow, focusReply }: ReplyToolProps) => {
    
    const { useTranslate } = useTranslateService()

    var reply = messages.find(e => e.id === event.tags.find(t => t[0] === "e")?.[1])
    if(!reply) return null

    useEffect(() => {
        if (reply?.content.includes("?iv=")) {
            messageService.decryptMessage(user, reply).then((event) => { 
                reply!.content = event.content
            });
        }
    }, [reply])

    const userReply = reply?.pubkey === user.pubkey ? useTranslate("chat.labels.you") 
        : getUserName(follow, 26)

    const focusReplyMessage = () => {
        const index = messages.findIndex(m => m.id == reply?.id)
        focusReply(index)
    }

    return (
        <TouchableOpacity activeOpacity={.7} 
                onPress={focusReplyMessage} style={styles.content}
            >
            <View style={{ width: "90%" }}>
                <Text style={{ color: theme.colors.green, fontSize: 16 }}>
                    {userReply}
                </Text>
                <Text style={{ color: theme.colors.gray }}>
                    {getClipedContent(reply.content, 130)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    content: { width: "100%", borderRadius: 10, borderLeftColor: theme.colors.blue,
        borderLeftWidth: 2, flexDirection: "row", padding: 6, paddingHorizontal: 10, },
})

export default ReplyTool
