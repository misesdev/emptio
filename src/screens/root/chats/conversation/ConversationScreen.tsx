import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import ConversationList from "./commons/ConversationList"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackScreenProps } from "@react-navigation/stack"
import ConversationHeader from "./commons/ConversationHeader"
import MessageGroupAction from "./commons/OptionGroup"
import DeleteOptionsBox from "./commons/DeleteOptionsBox"
import MessageShareBar from "./commons/ShareMessageBar"
import useConversation from "../hooks/useConversation"
import { useAccount } from "@src/context/AccountContext"
import useMessages from "../hooks/useMessages"
import { User } from "@services/user/types/User"
import ReplyBox from "./commons/ReplyBox"
import theme from "@src/theme"
import { FlatList } from "react-native"
import { useRef } from "react"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"

type ConversationProps = { chat_id: string, follow: User }

const ConversationScreen = ({ route }: StackScreenProps<any>) => {
    
    const { user } = useAccount()
    const listRef = useRef<FlatList>(null)
    const { useTranslate } = useTranslateService()
    const { follow, chat_id } = route.params as ConversationProps
    const selectedItems = useRef<Set<NDKEvent>>(new Set<NDKEvent>())
    const { 
        message, setMessage, replyMessage, setReplyMessage, chatMessages,
        selectionMode, sendMessage, deleteMessages
    } = useMessages({ user, chat_id, selectedItems })
    
    const { 
        highLigthIndex, setHighlightIndex, shareVisible,
        setShareVisible, forwardMessages, focusMessage, onGroupAction
    } = useConversation({ listRef, chatMessages, selectedItems })

    return (
        <View style={{ flex: 1 }}>

            {/* <Image style={{ position: "absolute", width: "100%", height: "100%" }} */}
            {/*     source={require("@assets/images/background-chat7.jpg")} */}
            {/* /> */}

            <ConversationHeader follow={follow} />
            
            {selectionMode && 
                <MessageGroupAction handleAction={onGroupAction}/>
            }

            <ConversationList user={user} follow={follow} 
                listRef={listRef} 
                events={chatMessages} 
                highLigthIndex={highLigthIndex}
                setHighlightIndex={setHighlightIndex}
                selectedItems={selectedItems}
                setReplyEvent={setReplyMessage}
            />

            {/* Chat Box */}
            <View style={styles.chatBoxContainer}>
                {/* Reply Box */}
                {replyMessage && 
                    <ReplyBox user={user} follow={follow} 
                        focusEventOnList={focusMessage} 
                        reply={replyMessage} setReply={setReplyMessage} 
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
                sendMessages={forwardMessages}
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

export default ConversationScreen

