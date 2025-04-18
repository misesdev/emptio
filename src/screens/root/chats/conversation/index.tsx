import { useCallback, useEffect, useRef, useState } from "react"
import { View, StyleSheet, TextInput, FlatList,  
    TouchableOpacity, BackHandler} from "react-native"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useAuth } from "@src/providers/userProvider"
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
import { copyToClipboard, getUserName } from "@src/utils"
import DeleteOptionsBox, { showDeleteOptions } from "./commons/delete"
import { useFocusEffect } from "@react-navigation/native"
import MessageShareBar from "./commons/share"
import { timeSeconds } from "@services/converter"
import { pushMessage } from "@services/notification"
import { messageService } from "@services/message"

const ConversationChat = ({ route }: StackScreenProps<any>) => {
    
    const { ndk } = useNDKStore()
    const { user }= useAuth()
    const timeout:any = useRef(null)
    const listRef = useRef<FlatList>(null)
    const selectedItems = useRef<Set<NDKEvent>>(new Set<NDKEvent>())
    const [highLigthIndex, setHighlightIndex] = useState<number|null>(null)
    const [replyEvent, setReplyEvent] = useState<NDKEvent|null>(null)
    const { useTranslate } = useTranslateService()
    const { markReadChat, unreadChats, removeChat } = useChatStore()
    const { follow, chat_id } = route.params as { chat_id: string, follow: User }
    const { selectionMode, toggleSelectionMode } = useChatStore()
    const [message, setMessage] = useState<string>("")
    const [shareVisible, setShareVisible] = useState(false)
    const [chatMessages, setChatMessages] = useState<NDKEvent[]>([])

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
        }, [selectionMode, selectedItems.current])
    )

    const loadMessages = useCallback(async () => {
        
        if(unreadChats.filter(c => c == chat_id).length) 
            markReadChat(chat_id)

        const chatMessages = await messageService.listMessages(chat_id)
       
        setChatMessages(chatMessages)
    }, [chat_id, unreadChats])

    const sendMessage = async (follow: User) => {
        if(!message.trim().length) return
        const messageTags: string[][] = [["p", follow.pubkey??""]]
        if(replyEvent) messageTags.push(["e", replyEvent.id])
        const messageEvent: NDKEvent = new NDKEvent(ndk, {
            kind: 4,
            pubkey: user.pubkey??"",
            content: message,
            tags: messageTags,
            created_at: timeSeconds.now() 
        }) 
        setTimeout(() => messageService.sendMessage(messageEvent), 10)
        setChatMessages(prev => [...prev, messageEvent])
        setReplyEvent(null)
        setMessage("")
    }

    const focusEventOnList = useCallback((event: NDKEvent|null) => {
        try {
            if(event) 
            {
                const index = chatMessages.findIndex(e => e.id == event.id)
                if(index != -1) {
                    listRef.current?.scrollToIndex({ viewPosition: .5, animated: true, index })
                    setHighlightIndex(index)
                    //setTimeout(() => setHighlightIndex(null), 350)
                }
            }
        } catch {}
    }, [chatMessages, highLigthIndex, listRef.current])
    
    const deleteMessages = useCallback(async (onlyForMe: boolean) => {
        
        toggleSelectionMode(false)
        
        setTimeout(async () => {
            const messages = Array.from(selectedItems.current)
            await messageService.deleteMessages({ events: messages, onlyForMe, user })
            selectedItems.current.clear()
        })

        const event_ids = Array.from(selectedItems.current).map(e => e.id) 

        setChatMessages(prev => [
            ...prev.filter(e => !event_ids.includes(e.id))
        ])

        setTimeout(() => {
            if(!chatMessages.length) removeChat(chat_id)
        }, 20)
        
    }, [user, selectedItems.current, selectionMode])

    const fowardMessages = (follow: User) => {
        setShareVisible(false)
        selectedItems.current.forEach(event => {
            messageService.sendMessage({ 
                user, 
                follow, 
                message: event.content, 
                forward: true 
            })
        })
        pushMessage(`${useTranslate("feed.videos.shared-for")} ${getUserName(follow, 20)}`)
        selectedItems.current.clear()
        toggleSelectionMode(false)
    }

    const handleGroupAction = useCallback((option: MessageActionType) => {
        if(option == "delete") showDeleteOptions()
        if(option == "copy") {
            toggleSelectionMode(false)
            copyToClipboard([...selectedItems.current].map(e => e.content).reverse().join("\n\n"))
            selectedItems.current.clear()
        }
        if(option == "forward") setShareVisible(true) 
        if(option == "cancel") {
            toggleSelectionMode(false)
            selectedItems.current.clear()
        }
    }, [selectionMode, toggleSelectionMode, setShareVisible, 
            copyToClipboard, selectedItems.current])

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
                events={chatMessages} 
                highLigthIndex={highLigthIndex}
                setHighlightIndex={setHighlightIndex}
                selectedItems={selectedItems}
                setReplyEvent={setReplyEvent}
            />

            {/* Chat Box */}
            <View style={styles.chatBoxContainer}>
                {/* Reply Box */}
                {replyEvent && 
                    <ReplyBox user={user} follow={follow} 
                        focusEventOnList={focusEventOnList} 
                        reply={replyEvent} setReply={setReplyEvent} 
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
    sendButton: { borderRadius: 50, padding: 10, transform: [{ rotate: "45deg" }] },
})

export default ConversationChat

