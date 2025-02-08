import { messageService } from "@/src/core/messageManager"
import theme from "@/src/theme"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useEffect, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import Ionicons from 'react-native-vector-icons/Ionicons'

type ChatProps = {
    event: NDKEvent,
    visible: boolean,
    setVisible: (state: boolean) => void
}
const VideoChat = ({ event, visible, setVisible }: ChatProps) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [events, setEvents] = useState<NDKEvent[]>()

    useEffect(() => {
        if(visible) {
            setLoading(true)
            messageService.listAnswers(event).then(e => {
                setLoading(false)
                setEvents(e)
            })
        }
    }, [visible])

    const handlePostMessage = () => {

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
                        renderItem={() => <></>}
                        style={{ flex: 1 }}
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
                        <View style={{ height: 10 }} ></View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlayer: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.semitransparent },
    modalContainer: {
        height: "70%", // Ocupa 70% da tela
        backgroundColor: theme.colors.semitransparentdark,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    closeButton: {
        fontSize: 22,
        color: "#555",
    },
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
