import { hexToNpub } from "@/src/services/converter"
import theme from "@/src/theme"
import { useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, TextInput, 
    KeyboardAvoidingView, Platform, TouchableOpacity, Vibration } from "react-native"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useAuth } from "@/src/providers/userProvider"
import { messageService } from "@/src/core/messageManager"
import { User } from "@/src/services/memory/types"
import useChatStore from "@/src/services/zustand/chats"
import ConversationList from "./list"
import MessageOptionsBox, { showOptiosMessage } from "./options"
import Ionicons from "@react-native-vector-icons/ionicons"

const ConversationChat = ({ navigation, route }: any) => {
    
    const { user }= useAuth()
    const { markReadChat, unreadChats } = useChatStore()
    const { follow, chat_id } = route.params as { chat_id: string, follow: User }
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<NDKEvent[]>([])

    useEffect(() => {
        // if(unreadChats.filter(c => c == chat_id).length) markReadChat(chat_id)
        // if(!unreadChats.filter(c => c == chat_id).length) 
            messageService.listMessages(chat_id).then(setMessages)
    }, [unreadChats])

    const sendMessage = async (follow: User) => {
        const event = await messageService.sendMessage({ user, follow, message })
        setMessages([event, ...messages])
        setMessage("")
    }

    const messageOptions = async (event: NDKEvent, isUser: boolean) => {
        Vibration.vibrate(75)
        showOptiosMessage({ event, isUser })
    }

    const deleteMessage = async (user: User, event: NDKEvent, onlyForMe: boolean) => {
        messageService.deleteMessage({ user, event, onlyForMe })
        setMessages(messages.filter(e => e.id != event.id))
    }

    const getUserName = () : string => {
        var userName = follow.display_name ?? follow.name ?? ""
        return userName.length > 20 ? `${userName?.substring(0,20)}..` : userName
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding": "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
        >
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={{ width: "15%", padding: 5 }}>
                    <View style={styles.imageContainer}>
                        {follow?.picture && <Image onError={() => { follow.picture = "" }} source={{ uri: follow?.picture }} style={{ flex: 1 }} />}
                        {!follow?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}                               
                    </View>
                </View>
                <View style={{ width: "70%", padding: 5 }}>
                    <View style={{ }}>
                        <Text style={styles.userName}>
                            {getUserName()}
                        </Text>
                        <Text style={styles.pubkey}>
                            {hexToNpub(follow.pubkey ?? "").substring(0, 28)}..
                        </Text>
                    </View>
                </View>
            </View>

            <ConversationList user={user} events={messages} onMessageOptions={messageOptions} />

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
                        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(follow)} >
                            <Ionicons name="paper-plane" 
                                size={24} color={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 45 }} ></View>
            </View>
            <MessageOptionsBox user={user} deleteMessage={deleteMessage} />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    headerContainer: { flexDirection: "row", width: "100%", padding: 2, backgroundColor: theme.colors.black },
    imageContainer: { width: 40, height: 40, borderRadius: 50, overflow: "hidden" },
    userName: { fontSize: 18, fontWeight: "500", color: theme.colors.white },
    pubkey: { fontSize: 14, fontWeight: "400", color: theme.colors.gray },

    chatBoxContainer: {  padding: 10, width: "100%", backgroundColor: theme.colors.black },
    chatInputContainer: { width: "82%", borderRadius: 20, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.green, 
        transform: [{ rotate: "45deg" }]
    },
})

export default ConversationChat

