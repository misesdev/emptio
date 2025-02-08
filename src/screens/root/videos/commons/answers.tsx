import NoteViewer from "@/src/components/nostr/event/NoteViewer"
import { messageService } from "@/src/core/messageManager"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useCallback, useEffect, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import { ActivityIndicator } from "react-native-paper"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@/src/theme"

type ChatProps = {
    event: NDKEvent,
    visible: boolean,
    setVisible: (state: boolean) => void
}
const VideoChat = ({ event, visible, setVisible }: ChatProps) => {

    const [message, setMessage] = useState<string>("")
    const [events, setEvents] = useState<NDKEvent[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(visible) handleLoadMessages()
    }, [visible])

    const handleLoadMessages = async () => {
        setLoading(true)
        setTimeout(async () => {
            const messages = await messageService.listAnswers(event)
            setEvents(messages)
            setLoading(false)
        }, 20)
    }

    const handlePostMessage = () => {

    }

    const renderItem = useCallback(({ item }: { item: NDKEvent }) => {
        return <NoteViewer note={item} />
    }, [])

    const Loader = () => {
        if(!loading) return <></>

        return <ActivityIndicator size={22} color={theme.colors.white} />
    }

    return (
        <Modal visible={visible} transparent animationType="slide"
            onRequestClose={() => setVisible(false)}>
            <View style={styles.overlayer}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Comentários</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        data={events}
                        keyExtractor={event => event.id}
                        renderItem={renderItem}
                        style={{ flex: 1 }}
                        initialNumToRender={10}
                        ListFooterComponent={<Loader/>}
                    />
                    {/* Chat Box */}
                    <View style={styles.chatBoxContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.chatInputContainer}>
                                <TextInput style={styles.chatInput} 
                                    value={message} 
                                    onChangeText={setMessage} 
                                    multiline
                                    numberOfLines={5}
                                    textContentType="none"
                                    placeholder="Mensagem"//{useTranslate("labels.message")}
                                    placeholderTextColor={theme.input.placeholderColor}
                                    underlineColorAndroid={theme.colors.transparent}
                                />
                            </View> 
                            <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.sendButton} onPress={handlePostMessage} >
                                    <Ionicons name="paper-plane" 
                                        size={24} color={theme.colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.transparent },
    modalContainer: {
        height: "70%",
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

export default VideoChat
