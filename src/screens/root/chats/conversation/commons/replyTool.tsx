import { useTranslateService } from "@/src/providers/translateProvider"
import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { getClipedContent, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

interface ReplyToolProps {
    event: NDKEvent
    messages: NDKEvent[],
    user: User,
    follow: User,
    focusEventOnList: (event: NDKEvent) => void
}

const ReplyTool = ({ event, messages, user, follow, focusEventOnList }: ReplyToolProps) => {
    
    const { useTranslate } = useTranslateService()

    const reply = messages.find(e => e.id === event.tags.find(t => t[0] === "e")?.[1])
    if(!reply) return null

    const userReply = reply?.pubkey === user.pubkey ? useTranslate("chat.labels.you") 
        : getUserName(follow, 26)

    const handleFocusReply = reply ? () => focusEventOnList(reply) : undefined 

    return (
        <TouchableOpacity activeOpacity={.7} 
                onPress={handleFocusReply} style={styles.content}
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
    content: { width: "100%", borderRadius: 6, borderLeftColor: theme.colors.blue,
        borderLeftWidth: 2, flexDirection: "row", padding: 6, paddingHorizontal: 10, },
})

export default ReplyTool
