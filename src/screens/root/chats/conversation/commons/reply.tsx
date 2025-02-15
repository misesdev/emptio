import { User } from "@/src/services/memory/types"
import theme from "@/src/theme"
import { getClipedContent, getUserName } from "@/src/utils"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"
import { MutableRefObject } from "react"

interface ReplyProps {
    user: User,
    follow: User,
    reply: MutableRefObject<NDKEvent|null>
    focusEventOnList: (event: NDKEvent|null) => void
}

const ReplyBox = ({ reply, focusEventOnList, user, follow }: ReplyProps) => {
    
    if(!reply.current) return null
    
    const { useTranslate } = useTranslateService()
   
    const handleClean = () => reply.current = null 

    const userReply = reply.current?.pubkey === user.pubkey ? useTranslate("chat.labels.you")
        : getUserName(follow, 26)

    const handleFocusReply = reply.current ? () => focusEventOnList(reply.current) : undefined

    if(!reply) return <></>

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
                        {getClipedContent(reply.current.content, 130)}
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
    container: { width: "100%", padding: 4, backgroundColor: theme.colors.semitransparent },
    content: { width: "100%", borderRadius: 6, borderLeftColor: theme.colors.blue,
        borderLeftWidth: 2, flexDirection: "row", padding: 6, paddingHorizontal: 10, },
    close: { padding: 4, borderRadius: 50, backgroundColor: theme.colors.blueOpacity }
})

export default ReplyBox
