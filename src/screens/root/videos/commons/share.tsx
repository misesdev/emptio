
import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { FollowList } from "@components/nostr/follow/FollowList"
import { User } from "@services/memory/types"
import { useTranslateService } from "@/src/providers/translateProvider"
import { messageService } from "@services/message"
import { useAuth } from "@src/providers/userProvider"
import { pushMessage } from "@services/notification"
import { getUserName } from "@src/utils"
import theme from "@src/theme"

type ChatProps = {
    event: NostrEvent,
    visible: boolean,
    setVisible: (state: boolean) => void
}

const VideoShareBar = ({ event, visible, setVisible }: ChatProps) => {

    const { user } = useAuth()
    const { useTranslate } = useTranslateService()

    const handleSend = (follow: User) => {

        const message = (event as NDKEvent).encode(2)

        setTimeout(() => { 
            messageService.sendMessage({ user, follow, message })
        }, 20)
        
        pushMessage(`${useTranslate("feed.videos.shared-for")} ${getUserName(follow, 20)}`)
    }

    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {useTranslate("feed.videos.share")}
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {visible && 
                        <FollowList searchable toSend 
                            searchTimout={200}
                            onPressFollow={handleSend} 
                        />
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent },
    modalContainer: {
        height: "70%", // Ocupa 70% da tela
        backgroundColor: theme.colors.semitransparentdark,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 10
    },
    headerText: { fontSize: 18, fontWeight: "bold", color: theme.colors.white },
    closeButton: { fontSize: 22, color: "#555" },
    inputBox: { position: "absolute", bottom: 10, width: "100%" },
    chatBoxContainer: {  padding: 10, width: "100%", backgroundColor: theme.colors.black },
    chatInputContainer: { width: "82%", borderRadius: 20, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.blue, 
        transform: [{ rotate: "45deg" }]
    },
})

export default VideoShareBar
