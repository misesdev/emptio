import { User } from "@services/memory/types"
import { FlatList } from "react-native-gesture-handler"
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { ChatUser } from "@services/zustand/chats"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useCallback, useEffect, useState } from "react"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import theme from "@src/theme"
import { userService } from "@src/core/userManager"
import { messageService } from "@src/core/messageManager"
import { getUserName } from "@/src/utils"
import { useAuth } from "@/src/providers/userProvider"
import { MutableRefObject } from "react"

export type FilterChat = { 
    user_name: string, 
    chat_id: string,
    is_friend: boolean,
    profile: User 
}

type Props = {
    user: User, 
    chats?: ChatUser[],
    filters: FilterChat[],
    selectedItems: MutableRefObject<ChatUser[]>,
    selectionMode: MutableRefObject<boolean>,
    handleOpenChat: (chat_id: string, user: User) => void
}

const ChatList = ({ user, chats, filters, selectionMode, selectedItems, handleOpenChat }: Props) => {
  
    const { follows } = useAuth()
    const { useTranslate } = useTranslateService()

    const EmptyComponent = () => {
        return (
            <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const ListItem = useCallback(({ item }: { item: ChatUser }) => {

        const [follow, setFollow] = useState<User>({})
        const [pictureError, setPictureError] = useState(false)
        const [selected, setSelected] = useState(false)
        const [event, setEvent] = useState<NDKEvent>(item.lastMessage)

        useEffect(() => { setTimeout(loadItemData, 20) }, [])
        useEffect(() => {
            if(!selectionMode.current) setSelected(false)
        }, [selectionMode.current])

        const loadItemData = async () => {
            var profile = follows?.find(f => f.pubkey == item.lastMessage.pubkey)
            
            if(!profile) {
                profile = filters.find(f => f.profile.pubkey == item.lastMessage.pubkey)?.profile
            }
            if(!profile) 
                profile = await userService.getProfile(item.lastMessage.pubkey)

            if(event.content.includes("?iv=")) {
                const decrypted = await messageService.decryptMessage(user, item.lastMessage)
                setEvent(decrypted)
            }
            
            if(!filters.find(f => f.chat_id == item.chat_id)) {
                filters.push({
                    profile: profile,
                    chat_id: item.chat_id, 
                    user_name: getUserName(profile, 30),
                    is_friend: !!follows.filter(f => f.pubkey == profile?.pubkey).length,
                })
            }
            setFollow(profile)
        }

        const handleOnPress = () => {
            if(selectionMode.current) {
                if(!selected) selectedItems.current.push(item) 
                if(selected) selectedItems.current.splice(selectedItems.current.indexOf(item), 1) 
                setTimeout(() => {
                    if(!selectedItems.current.length) selectionMode.current = false
                }, 20)
                setSelected(prev => !prev)
            } else
                handleOpenChat(item.chat_id, follow)
        }

        const handleSelectionMode = () => {
            setSelected(true)
            selectionMode.current = true
            selectedItems.current.push(item)
        }

        return (
            <View style={[styles.chatContainer, {
                    backgroundColor: selected ? theme.colors.blueOpacity : "transparent"
                }]}
            >
                <TouchableOpacity
                    activeOpacity={.7}
                    style={styles.chatRow}
                    onPress={handleOnPress}
                    onLongPress={handleSelectionMode}
                >
                    <View style={{ width: "15%" }}>
                        <View style={styles.profile}>
                            {follow?.picture && <Image onError={() => setPictureError(true)} source={{ uri: follow.picture }} style={{ flex: 1 }} />}
                            {(!follow?.picture || pictureError) && <Image source={require("@assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}
                        </View>
                        {selected && 
                            <Ionicons name="checkmark-circle" size={24} color={theme.colors.green} 
                                style={{ position: "absolute", bottom: 0, right: 0 }}
                            />
                        }
                    </View>
                    <View style={{ width: "60%", overflow: "hidden" }}>
                        {(follow.display_name || follow.name) &&
                            <View style={{ width: "100%" }}>
                                <Text style={styles.profileName}>
                                    {getUserName(follow, 24)}
                                </Text>
                            </View>
                        }
                        <View style={{ width: "100%" }}>
                            <Text style={styles.message}>
                                {event.content.substring(0, 26).replaceAll("\n", " ")}..
                            </Text>
                        </View>
                    </View>                    
                    <View style={{ width: "25%", overflow: "hidden", flexDirection: "row-reverse" }}>
                        <Text style={styles.dateMessage}>
                            {new Date((event.created_at ?? 1) * 1000).toDateString()}
                        </Text>
                    </View>
                    { !!item.unreadCount && 
                        <View style={styles.notify}>
                            <Text style={{ fontSize: 10, color: theme.colors.white }}>
                                {item.unreadCount}
                            </Text>
                        </View>
                    } 
                </TouchableOpacity>
            </View>
        )
    }, [selectionMode])

    const renderItem = useCallback(({ item }: { item: ChatUser }) => {
        return <ListItem item={item}/>
    }, [])

    return (
        <FlatList
            data={chats}
            extraData={selectionMode}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.chat_id}-${item?.unreadCount??0}`}
            style={styles.chatsScroll}
            ListEmptyComponent={EmptyComponent}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    chatsScroll: { flex: 1, paddingVertical: 10 },
    chatContainer: { width: "100%", padding: 10, marginVertical: 2, borderRadius: 10 },
    chatRow: { paddingVertical: 5, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, paddingTop: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 16, right: 14, borderRadius: 4, 
        backgroundColor: theme.colors.red, padding: 2, minWidth: 18, alignItems: "center" }
})

export default ChatList
