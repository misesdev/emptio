import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, TextInput, 
    TouchableOpacity, Vibration } from "react-native"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useAuth } from "@src/providers/userProvider"
import { messageService } from "@src/core/messageManager"
import { User } from "@services/memory/types"
import useChatStore from "@services/zustand/chats"
import ConversationList from "./list"
import MessageOptionsBox, { showOptiosMessage } from "./options"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@/src/theme"
import { StackScreenProps } from "@react-navigation/stack"
import ConversationHeader from "./header"

const ConversationChat = ({ navigation, route }: StackScreenProps<any>) => {
    
    const { user }= useAuth()
    const timeout:any = useRef(null)
    const { markReadChat, unreadChats } = useChatStore()
    const { follow, chat_id } = route.params as { chat_id: string, follow: User }
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<NDKEvent[]>([])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: false,
            header: () => <ConversationHeader follow={follow} />
        })
    },[])

    useEffect(() => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(async() => { 
            await loadMessages() 
        }, 20)
    }, [unreadChats])

    const loadMessages = async () => {
        const chatMessages = await messageService.listMessages(chat_id)
        
        setMessages(chatMessages)

        if(unreadChats.filter(c => c == chat_id).length) 
            markReadChat(chat_id)
    }

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

    return (
        <View style={theme.styles.container}>

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
                <View style={{ height: 10 }} ></View>
            </View>
            <MessageOptionsBox user={user} deleteMessage={deleteMessage} />
        </View>
    )
}

const styles = StyleSheet.create({
    chatBoxContainer: {  padding: 10, width: "100%", backgroundColor: theme.colors.black },
    chatInputContainer: { width: "82%", borderRadius: 20, paddingHorizontal: 18, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.blue, 
        transform: [{ rotate: "45deg" }]
    },
})

export default ConversationChat

