import NoteViewer from "@components/nostr/event/NoteViewer"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { useCallback, useEffect, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import { ActivityIndicator } from "react-native-paper"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { noteService } from "@services/nostr/noteService"
import theme from "@/src/theme"

type ChatProps = {
    event: NDKEvent,
    visible: boolean,
    setVisible: (state: boolean) => void
}
const VideoComments = ({ event, visible, setVisible }: ChatProps) => {

    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [message, setMessage] = useState<string>("")
    const [comments, setComments] = useState<NDKEvent[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(visible) setTimeout(handleLoadMessages, 20)
    }, [visible])

    const handleLoadMessages = async () => {
        
        const filter: NDKFilter = { 
            kinds: [1], "#p": [event.pubkey], "#e": [event.id], since: event.created_at 
        }

        const subscription = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        }) 
        
        subscription.on("event", event => setComments(prev => [...prev, event]))

        subscription.on("close", () => {})
        subscription.on("eose", () => {})

        subscription.start()

        setTimeout(() => {
            subscription.stop()
        }, 300)
    }

    const handlePostComment = () => {

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
                        <Text style={styles.headerText}>
                            {useTranslate("feed.videos.comments")}
                        </Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        data={comments}
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
                                    placeholder={useTranslate("feed.videos.comment")}
                                    placeholderTextColor={theme.input.placeholderColor}
                                    underlineColorAndroid={theme.colors.transparent}
                                />
                            </View> 
                            <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.sendButton} onPress={handlePostComment} >
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

export default VideoComments
