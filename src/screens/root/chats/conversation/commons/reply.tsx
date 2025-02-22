import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { getClipedContent, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"

interface ReplyProps {
    user: User,
    follow: User,
    reply: NDKEvent,
    setReply: (event: NDKEvent|null) => void,
    focusEventOnList: (event: NDKEvent|null) => void
}

const ReplyBox = ({ reply, setReply, focusEventOnList, user, follow }: ReplyProps) => {
    
    if(!reply) return null
    
    const { useTranslate } = useTranslateService()
   
    const handleClean = () => setReply(null) 

    const userReply = reply?.pubkey === user.pubkey ? useTranslate("chat.labels.you")
        : getUserName(follow, 26)

    const handleFocusReply = reply ? () => focusEventOnList(reply) : undefined

    return (
        <View style={styles.container}>
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
                <View style={{ width: "10%", alignItems: "flex-end" }}>
                    <TouchableOpacity style={styles.close} onPress={handleClean}>
                        <Ionicons name="close" size={18} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: "100%", padding: 4, borderRadius: 10, marginBottom: 10,
        backgroundColor: theme.colors.semitransparent },
    content: { width: "100%", borderRadius: 6, borderLeftColor: theme.colors.blue,
        borderLeftWidth: 2, flexDirection: "row", padding: 6, paddingHorizontal: 10, },
    close: { padding: 4, borderRadius: 50, backgroundColor: theme.colors.blueOpacity }
})

export default ReplyBox
