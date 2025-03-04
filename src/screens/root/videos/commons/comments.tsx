import NoteViewer from "@components/nostr/event/NoteViewer"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { useCallback, useMemo, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity, 
    TextInput, FlatList } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslateService } from "@src/providers/translateProvider"
import useNDKStore from "@services/zustand/ndk"
import { useAuth } from "@src/providers/userProvider"
import { timeSeconds } from "@services/converter"
import theme from "@src/theme"

interface VideoCommentsProps {
    event: NDKEvent,
    comments: NDKEvent[],
    visible: boolean,
    setVisible: (state: boolean) => void
}

const VideoComments = ({ event, visible, comments, setVisible }: VideoCommentsProps) => {

    const { user } = useAuth()
    const { ndk } = useNDKStore()
    const { useTranslate } = useTranslateService()
    const [comment, setComment] = useState<string>("")
    
    const memorizedComments = useMemo(() => {
        return comments.sort((a,b) => (a.created_at??1)-(b.created_at??1))
    }, [comments])

    const handlePostComment = useCallback(async () => {
        if(!comment.trim().length) return

        const myComment = new NDKEvent(ndk, {
            kind: 1,
            pubkey: user.pubkey??"",
            content: comment.trim(),
            tags: [
                ["e", event.id, "", "root"],
                ["p", event.pubkey]
            ],
            created_at: timeSeconds.now()
        })

        await myComment.sign()
        // comment.publishReplaceable()

        //setComments(prev => [...prev, myComment])
        setComment("")

    }, [comment, user, event])

    const handleReact = useCallback((event: NDKEvent) => {

    }, [user])

    const renderItem = useCallback(({ item }: { item: NDKEvent }) => {
        return (
            <View style={{ width: "100%", paddingVertical: 10 }}>
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ width: "90%" }}>
                        <NoteViewer note={item} />
                    </View>
                    <View style={{ width: "10%", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => handleReact(item)}>
                            <Ionicons name="heart" size={20} color={theme.colors.white} /> 
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: "100%", paddingTop: 10, flexDirection: "row" }}>
                    <TouchableOpacity activeOpacity={.7} style={{ marginHorizontal: 10, flexDirection: "row" }}>
                        <Text style={{ color: theme.colors.gray }}>
                            Responder
                        </Text>
                        <Ionicons style={{ margin: 2 }} name="chevron-forward" size={16} color={theme.colors.gray} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={{ marginHorizontal: 10, flexDirection: "row" }}>
                        <Text style={{ color: theme.colors.gray }}>
                            Ver mais (115) respostas
                        </Text>
                        <Ionicons style={{ margin: 2 }} name="chevron-forward" size={16} color={theme.colors.gray} />
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                        ListEmptyComponent={<EmptyComponent />}
                    />
                    {/* Chat Box */}
                    <View style={styles.chatBoxContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.chatInputContainer}>
                                <TextInput style={styles.chatInput} 
                                    value={comment} 
                                    onChangeText={setComment} 
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
    modalContainer: { height: "70%", backgroundColor: theme.colors.semitransparentdark,
        borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10, paddingHorizontal: 10 },
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
