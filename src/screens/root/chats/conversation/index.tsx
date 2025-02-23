import { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet, TextInput, FlatList, Image, 
    TouchableOpacity, BackHandler} from "react-native"
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
import DeleteOptionsBox, { showDeleteOptions } from "./commons/delete"
import { useFocusEffect } from "@react-navigation/native"
import MessageShareBar from "./commons/share"
import { timeSeconds } from "@/src/services/converter"

const ConversationChat = ({ route }: StackScreenProps<any>) => {
    
    const { ndk } = useNDKStore()
    const { user }= useAuth()
    const timeout:any = useRef(null)
    const listRef = useRef<FlatList>(null)
    const selectedItems = useRef<Set<NDKEvent>>(new Set<NDKEvent>())
    const highLigthIndex = useRef<number|null>(null)
    const replyIndex = useRef<number|null>(null)
    const replyEvent = useRef<NDKEvent|null>(null)
    const { useTranslate } = useTranslateService()
    const { markReadChat, unreadChats, removeChat } = useChatStore()
    const { follow, chat_id } = route.params as { chat_id: string, follow: User }
    const { selectionMode, toggleSelectionMode } = useChatStore()
    const [message, setMessage] = useState<string>("")
    const [shareVisible, setShareVisible] = useState(false)
    const messagesRef = useRef<NDKEvent[]>([])

    useEffect(() => {
        if(timeout.current) 
            clearTimeout(timeout.current)
        timeout.current = setTimeout(loadMessages, 10)
        return () => timeout.current && clearTimeout(timeout.current)
    }, [unreadChats])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (selectionMode) {
                    toggleSelectionMode(false)
                    selectedItems.current.clear()
                    return true 
                }
                return false 
            }

            const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

            return () => backHandler.remove() 
        }, [selectionMode, selectedItems])
    )

    const setReplyEvent = useCallback((event: NDKEvent|null, index: number|null=null) => {
        replyEvent.current = event
        replyIndex.current = index
    }, [replyEvent])

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
            created_at: timeSeconds.now() 
        }) 
        setTimeout(() => messageService.sendMessage(messageEvent), 10)
        messagesRef.current.unshift(messageEvent)
        setReplyEvent(null)
        setMessage("")
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
    
    const deleteMessages = useCallback(async (onlyForMe: boolean) => {
        
        toggleSelectionMode(false)
        
        setTimeout(async () => {
            const messages = Array.from(selectedItems.current)
            await messageService.deleteMessages({ events: messages, onlyForMe, user })
        })

        const event_ids = Array.from(selectedItems.current).map(e => e.id) 

        messagesRef.current = [
            ...messagesRef.current.filter(e => !event_ids.includes(e.id))
        ]

        if(!messagesRef.current.length) removeChat(chat_id) 
        
        selectedItems.current.clear()
    }, [user, selectedItems, selectionMode])

    const fowardMessages = (follow: User) => {
        console.log("send selected messages")

        selectedItems.current.clear()
        toggleSelectionMode(false)
    }

    const handleGroupAction = useCallback((option: MessageActionType) => {
        if(option == "delete") showDeleteOptions()
        if(option == "copy") {
            toggleSelectionMode(false)
            copyToClipboard([...selectedItems.current].map(e => e.content).join("\n\n"))
            selectedItems.current.clear()
        }
        if(option == "foward") setShareVisible(true) 
        if(option == "cancel") {
            toggleSelectionMode(false)
            selectedItems.current.clear()
        }
    }, [selectionMode, toggleSelectionMode, setShareVisible, copyToClipboard, selectedItems])

    return (
        <View style={{ flex: 1 }}>

            {/* <Image style={{ position: "absolute", width: "100%", height: "100%" }} */}
            {/*     source={require("@assets/images/background-chat7.jpg")} */}
            {/* /> */}

            <ConversationHeader follow={follow} />
            
            {selectionMode && 
                <MessageGroupAction handleAction={handleGroupAction}/>
            }

            <ConversationList user={user} follow={follow} 
                listRef={listRef} 
                events={messagesRef.current} 
                highLigthIndex={highLigthIndex}
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
                    <View style={styles.sendButtonContainer}>
                        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(follow)} >
                            <Ionicons name="paper-plane" 
                                size={24} color={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <MessageShareBar visible={shareVisible} setVisible={setShareVisible}
                sendMessages={fowardMessages}
            />
            <DeleteOptionsBox deleteMessages={deleteMessages} />
        </View>
    )
}

const styles = StyleSheet.create({
    chatBoxContainer: { padding: 5, width: "96%", marginHorizontal: "2%", borderRadius: 10,
        marginVertical: 4, backgroundColor: theme.input.backGround },
    chatInputContainer: { width: "82%", borderRadius: 10, paddingHorizontal: 14, 
        backgroundColor: theme.input.backGround },
    chatInput: { color: theme.input.textColor, paddingVertical: 10, paddingHorizontal: 6 },
    sendButtonContainer: { width: "18%", alignItems: "center", justifyContent: "center" },
    sendButton: { borderRadius: 50, padding: 10, 
        transform: [{ rotate: "45deg" }]
    },
})

export default ConversationChat

