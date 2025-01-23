import { useTranslateService } from "@/src/providers/translateProvider"
import { hexToNpub } from "@/src/services/converter"
import theme from "@/src/theme"
import { memo, useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, TextInput, 
    KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { FlatList } from "react-native-gesture-handler"
import NDK, { NDKEvent, NostrEvent as NEvent } from "@nostr-dev-kit/ndk"
import { useAuth } from "@/src/providers/userProvider"
import { NostrEvent } from "@/src/services/nostr/events"
import NoteViewer from "@/src/components/nostr/event/NoteViewer"
import { useNotificationBar } from "@/src/providers/notificationsProvider"
import { UserChat } from "../list"
import { messageService } from "@/src/core/messageManager"

const ConversationChat = ({ navigation, route }: any) => {
    
    const { user }= useAuth()
    const userChat = route.params.userChat as UserChat
    const { setNotificationApp } = useNotificationBar()
    const { useTranslate } = useTranslateService()
    const [messageText, setMessageText] = useState<string>("")
    const [messages, setMessages] = useState<NostrEvent[]>([])
    const [selectionMode, setSelectionMode] = useState(false)

    useEffect(() => {
        if(setNotificationApp) setNotificationApp({ type: "message", state: false })
        handleLoadData()
    }, [])

    const handleLoadData = async () => {
        messageService.listMessages(userChat.lastMessage.chat_id ?? "").then(events => {
            setMessages(events as NostrEvent[])
        })
        .catch(ex => console.log(ex))
    }

    const sendMessage = async (follow: any) => {

        const message = messageText

        setMessageText("")

        console.log("sending message", message)

        const eventMessage: NDKEvent = new NDKEvent(Nostr as NDK, {
            kind: 4,
            pubkey: user.pubkey ?? "",
            content: message,
            tags: [["p", follow.pubkey ?? ""]],
            created_at: Date.now()
        })

        setMessages([eventMessage as NostrEvent, ...messages])

        await eventMessage.sign()

        // await eventMessage.encrypt()

        await eventMessage.publishReplaceable()
    }

    const deleteEvent = async (event: NDKEvent) => {

        console.log("deleting event")

        const pool = Nostr as NDK
    
        const exclude = new NDKEvent(pool, {
            pubkey: user.pubkey ?? "",
            kind: 5,
            content: "deleting event",
            tags: [["e", event.id ?? ""]],
            created_at: Math.floor(Date.now() / 1000)
        })

        await exclude.sign()

        await exclude.publish()

        console.log("deleted event")
    }

    const getUserName = () : string => {
        var userName = userChat.user.display_name ?? userChat.user.name ?? ""

        return userName.length > 20 ? `${userName?.substring(0,20)}..` : userName
    }

    const ListItem = memo(({ item }: { item: NostrEvent }) => {
       
        const isUser = (item.pubkey == user.pubkey)
        const [showDetails, setShowDetails] = useState(false)
        //const [event, setEvent] = useState(new NDKEvent(Nostr as NDK, item as NEvent))

        //event.pubkey = userChat.user.pubkey ?? ""

        // event.decrypt().then(() => {
        //     setEvent({...event} as NDKEvent)
        // })

        const onClickMessage = () => setShowDetails(!showDetails)

        return (
            <TouchableOpacity onLongPress={() => { deleteEvent(item as NDKEvent) }}
                onPress={onClickMessage} activeOpacity={1} 
                style={[styles.messageContainer, { flexDirection: isUser ? "row-reverse" : "row" }]}
            >
                <View style={[styles.contentMessage, 
                        isUser ? styles.messageSended : styles.messageReceived
                    ]}
                >
                    <NoteViewer note={item.content} />
                    {showDetails &&
                        <View style={styles.messageDetailBox}>
                            <Text style={{ fontSize: 11, fontWeight: "500", color: theme.colors.gray }}>
                                {new Date((item.created_at ?? 1) * 1000).toDateString()}
                            </Text>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding": "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={{ width: "15%", padding: 5 }}>
                    <View style={styles.imageContainer}>
                        {userChat.user?.picture && <Image onError={() => { userChat.user.picture = "" }} source={{ uri: userChat.user?.picture }} style={{ flex: 1 }} />}
                        {!userChat.user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}                               
                    </View>
                </View>
                <View style={{ width: "70%", padding: 5 }}>
                    <View style={{ }}>
                        <Text style={styles.userName}>
                            {getUserName()}
                        </Text>
                        <Text style={styles.pubkey}>{hexToNpub(userChat.user.pubkey ?? "").substring(0, 28)}..</Text>
                    </View>
                </View>
            </View>

            {/* List Of Messages */}
            <FlatList inverted
                data={messages}
                style={{ }}
                showsVerticalScrollIndicator
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.id ?? ""}
            />

            {/* Chat Box */}
            <View style={styles.chatBoxContainer}>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.chatInputContainer}>
                        <TextInput style={styles.chatInput} 
                            value={messageText} 
                            onChangeText={setMessageText} 
                            multiline
                            numberOfLines={5}
                            textContentType="none"
                            placeholder="Mensagem"//{useTranslate("labels.message")}
                            placeholderTextColor={theme.input.placeholderColor}
                            underlineColorAndroid={theme.colors.transparent}
                        />
                    </View> 
                    <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(userChat.user)} >
                            <Ionicons name="paper-plane" 
                                size={24} color={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 45 }} ></View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    headerContainer: { flexDirection: "row", width: "100%", padding: 2, backgroundColor: theme.colors.black },
    imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },

    chatBoxContainer: {  padding: 10, width: "100%", backgroundColor: theme.colors.black },
    chatInputContainer: { width: "82%", borderRadius: 20, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.green, 
        transform: [{ rotate: "45deg" }]
    },

    messageContainer: { width: "100%", padding: 10 },
    contentMessage: { width: "70%", padding: 15, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
    messageReceived: { backgroundColor: theme.colors.section, borderTopRightRadius: 12 },
    messageSended: { backgroundColor: theme.colors.blueOpacity, borderTopLeftRadius: 12 },

    messageDetailBox: { width: "100%", flexDirection: "row-reverse", marginTop: 12 },
    messageDetailsText: { }
})

export default ConversationChat

