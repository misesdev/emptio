import NoteViewer from "@components/nostr/event/NoteViewer"
import { NDKEvent, NDKFilter, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk-mobile"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity, 
    TextInput, FlatList } from "react-native"
import { RefreshControl } from "react-native-gesture-handler"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useAuth } from "@src/providers/userProvider"
import { timeSeconds } from "@services/converter"
import theme from "@src/theme"

interface ChatProps {
    event: NDKEvent,
    visible: boolean,
    setVisible: (state: boolean) => void
}
const VideoComments = ({ event, visible, setVisible }: ChatProps) => {

    const { user } = useAuth()
    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [message, setMessage] = useState<string>("")
    const [comments, setComments] = useState<NDKEvent[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    
    const memorizedComments = useMemo(() => {
        return comments.sort((a,b) => (a.created_at??1)-(b.created_at??1))
    }, [comments])

    useEffect(() => {
        if(visible) setTimeout(handleLoadComments, 10)
    }, [visible])

    const handleLoadComments = async () => {
        
        setRefreshing(true)

        const filter: NDKFilter = { 
            kinds: [1], "#e": [event.id]
        }

        const subscription = ndk.subscribe(filter, {
            cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
        }) 
        
        subscription.on("event", event => { 
            if(event.tags.find(t => t[0] == "e" && t[3] == "root")) {
                setComments(prev => [event, ...prev])
            }
        })

        const finish = () => setRefreshing(false)

        subscription.on("close", finish)
        subscription.on("eose", finish)

        subscription.start()

        setTimeout(() => {
            subscription.stop()
        }, 500)
    }

    const handlePostComment = useCallback(async () => {
        if(!message.trim().length) return

        const comment = new NDKEvent(ndk, {
            kind: 1,
            pubkey: user.pubkey??"",
            content: message.trim(),
            tags: [
                ["e", event.id, "", "root"],
                ["p", event.pubkey]
            ],
            created_at: timeSeconds.now()
        })

        await comment.sign()
        // comment.publishReplaceable()

        setComments(prev => [...prev, comment])
        setMessage("")

    }, [message, user, event])

    const renderItem = useCallback(({ item }: { item: NDKEvent }) => {
        return <NoteViewer note={item} />
    }, [])

    const EmptyComponent = () => {
        return (
            <Text style={styles.empty}>
                {useTranslate("feed.comments.empty")}
            </Text>
        )
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
                        data={memorizedComments}
                        keyExtractor={event => event.id}
                        renderItem={renderItem}
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.listComments}
                        initialNumToRender={10}
                        ListEmptyComponent={<EmptyComponent />}
                        refreshControl={<RefreshControl refreshing={refreshing}/>}
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
                                        style={{ transform: [{ rotate: "45deg" }] }}
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
    chatBoxContainer: {  width: "100%", borderRadius: 10,
        backgroundColor: theme.input.backGround },
    chatInputContainer: { width: "82%", borderRadius: 10, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 10, padding: 12 },

    listComments: { justifyContent: "center", alignItems: "center" },
    empty: { color: theme.colors.gray, marginTop: 200, textAlign: "center" }
})

export default VideoComments
