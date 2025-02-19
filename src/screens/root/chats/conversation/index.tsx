import { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet, TextInput, FlatList, Image, 
    TouchableOpacity } from "react-native"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useAuth } from "@src/providers/userProvider"
import { messageService } from "@src/core/messageManager"
import { User } from "@services/memory/types"
import useChatStore from "@services/zustand/chats"
import ConversationList from "./commons/list"
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from "@src/theme"
import { StackScreenProps } from "@react-navigation/stack"
import ConversationHeader from "./commons/header"
import { useTranslateService } from "@src/providers/translateProvider"
import ReplyBox from "./commons/reply"
import useNDKStore from "@services/zustand/ndk"
import MessageGroupAction, { MessageActionType } from "./commons/options"
import { copyToClipboard } from "@src/utils"

const ConversationChat = ({ navigation, route }: StackScreenProps<any>) => {
    
    const { ndk } = useNDKStore()
    const { user }= useAuth()
    const timeout:any = useRef(null)
    const listRef = useRef<FlatList>(null)
    const selectionMode = useRef<boolean>(false)
    const selectedItems = useRef<Set<NDKEvent>>(new Set<NDKEvent>())
    const highLigthIndex = useRef<number|null>(null)
    const replyIndex = useRef<number|null>(null)
    const replyEvent = useRef<NDKEvent|null>(null)
    const { useTranslate } = useTranslateService()
    const { markReadChat, unreadChats } = useChatStore()
    const { follow, chat_id } = route.params as { chat_id: string, follow: User }
    const [message, setMessage] = useState<string>("")
    const messagesRef = useRef<NDKEvent[]>([])

    useEffect(() => {
        if(timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(loadMessages, 10)

        return () => timeout.current && clearTimeout(timeout.current)
    }, [unreadChats])

    const setReplyEvent = useCallback((event: NDKEvent|null, index: number|null=null) => {
        replyEvent.current = event
        replyIndex.current = index
    }, [])

    const loadMessages = useCallback(async () => {
        
        if(unreadChats.filter(c => c == chat_id).length) 
            markReadChat(chat_id)

        const chatMessages = await messageService.listMessages(chat_id)
        
        messagesRef.current = chatMessages
    }, [chat_id, unreadChats])

    const sendMessage = async (follow: User) => {
        if(!message.trim().length) return
        const messageTags: string[][] = [["p", follow.pubkey??""]]
        if(replyEvent.current) messageTags.push(["e", replyEvent.current.id])
        const messageEvent: NDKEvent = new NDKEvent(ndk, {
            kind: 4,
            pubkey: user.pubkey??"",
            content: message,
            tags: messageTags,
            created_at: Math.floor(Date.now() / 1000)
        }) 
        messageService.sendMessage(messageEvent)
        messagesRef.current.unshift(messageEvent)
        setReplyEvent(null)
        setMessage("")
    }

    // const messageOptions = async (event: NDKEvent, isUser: boolean) => {
    //     Vibration.vibrate(45)
    //     showOptiosMessage({ event, isUser })
    // }

    const deleteMessage = async (user: User, event: NDKEvent, onlyForMe: boolean) => {
        messageService.deleteMessage({ user, event, onlyForMe })
        messagesRef.current = [...messagesRef.current.filter(e => e.id != event.id)]
    }

    const focusEventOnList = useCallback((event: NDKEvent|null) => {
        try {
            if(event) {
                const index = messagesRef.current.findIndex(e => e.id == event.id)
                if(index != -1) {
                    listRef.current?.scrollToIndex({ viewPosition: .5, animated: true, index })
                    highLigthIndex.current = index
                    setTimeout(() => highLigthIndex.current = null, 350)
                }
            }
        } catch {}
    }, [messagesRef, highLigthIndex, listRef])

    const handleGroupAction = useCallback((option: MessageActionType) => {
        if(option == "copy") {
            copyToClipboard([...selectedItems.current].map(e => e.content).join("\n\n"))
        }
        if(option == "delete") {
        }
        if(option == "cancel") {
        }
        selectionMode.current = false
        selectedItems.current.clear()
    }, [])

    return (
        <View style={theme.styles.container}>

            <Image style={{ position: "absolute", width: "100%", height: "100%" }}
                source={require("@assets/images/background-chat7.jpg")}
            />

            <ConversationHeader follow={follow} />
           
            {selectionMode.current && 
                <MessageGroupAction onAction={handleGroupAction}/>
            }

            <ConversationList user={user} follow={follow} 
                listRef={listRef} 
                events={messagesRef.current} 
                highLigthIndex={highLigthIndex}
                selectionMode={selectionMode} 
                selectedItems={selectedItems}
                setReplyEvent={setReplyEvent}
            />

            {/* Chat Box */}
            <View style={styles.chatBoxContainer}>
                {/* Reply Box */}
                {replyEvent.current && 
                    <ReplyBox user={user} follow={follow} 
                        focusEventOnList={focusEventOnList} 
                        reply={replyEvent.current} setReply={setReplyEvent} 
                    />
                }
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.chatInputContainer}>
                        <TextInput style={styles.chatInput} 
                            value={message} 
                            onChangeText={setMessage} 
                            multiline
                            numberOfLines={5}
                            textContentType="none"
                            placeholder={useTranslate("chat.labels.message")}
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatBoxContainer: { padding: 6, width: "100%", backgroundColor: theme.colors.transparent },
    chatInputContainer: { width: "82%", borderRadius: 10, paddingHorizontal: 14, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 16, paddingHorizontal: 6 },
    sendButton: { borderRadius: 50, padding: 12, backgroundColor: theme.colors.blue, 
        transform: [{ rotate: "45deg" }]
    },
})

export default ConversationChat

