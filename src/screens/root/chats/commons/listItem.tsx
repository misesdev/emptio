import { messageService } from "@/src/core/messageManager"
import { userService } from "@/src/core/userManager"
import { useAuth } from "@/src/providers/userProvider"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { User } from "@services/memory/types"
import useChatStore, { ChatUser } from "@services/zustand/chats"
import { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from "react"
import { FilterChat } from "./list"
import { getUserName } from "@src/utils"
import { Vibration, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
import theme from "@/src/theme"
import { getClipedContent } from "@src/utils"

interface ListItemProps {
    user: User,
    item: ChatUser,
    filters: FilterChat[],
    selectedItems: MutableRefObject<Set<ChatUser>>,
    handleOpenChat: (chat_id: string, user: User) => void,
    showProfile: (profile: User) => void
}

const ListItemChat = ({ item, user, filters,
    selectedItems, handleOpenChat, showProfile }: ListItemProps) => {

    const { follows } = useAuth()
    const selected = useRef(false);
    const highlight = useRef(new Animated.Value(0)).current
    const [follow, setFollow] = useState<User|null>(null)
    const eventRef = useRef<NDKEvent>(item.lastMessage)
    const { toggleSelectionMode, selectionMode } = useChatStore()

    useEffect(() => {
        if(!selectionMode && selected.current) {
            selected.current = false
            highlight.setValue(0) 
        }
    }, [selectionMode])

    const loadItemData = useCallback(async () => {
        
        if(follow?.pubkey) return

        var profile = follows?.find(f => f.pubkey == item.lastMessage.pubkey)
        
        if(!profile) 
            profile = filters.find(f => f.profile.pubkey == item.lastMessage.pubkey)?.profile
        
        if(!profile) 
            profile = await userService.getProfile(item.lastMessage.pubkey)

        if(eventRef.current.content.includes("?iv=")) {
            const decrypted = await messageService.decryptMessage(user, item.lastMessage)
            eventRef.current.content = decrypted.content
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
    }, [follows, follow, eventRef, filters])

    useEffect(() => { 
        loadItemData()
    }, [loadItemData])
    
    const handleOnPress = () => {
        if(selectionMode) 
        {
            selected.current = !selected.current
            highlight.setValue(selected.current ? 1 : 0)

            if(!selectedItems.current.has(item)) { 
                selectedItems.current.add(item) 
            } else {
                selectedItems.current.delete(item)
            }

            if(selectedItems.current.size === 0)
                toggleSelectionMode(false)
        } 
        else if(follow) {
            handleOpenChat(item.chat_id, follow)
        }
    }

    const handleSelectionMode = () => {
        highlight.setValue(1)
        selected.current = true
        toggleSelectionMode(true)
        selectedItems.current.add(item)
        Vibration.vibrate(45)
    }

    const backgroundColor = highlight.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", theme.colors.disabled],
    })

    return (
        <Animated.View style={[styles.chatContainer, { backgroundColor }]}>
            <TouchableOpacity
                activeOpacity={.7}
                delayLongPress={150}
                style={styles.chatRow}
                onPress={handleOnPress}
                onLongPress={handleSelectionMode}
            >
                <TouchableOpacity onPress={() => showProfile(follow??{})} style={{ width: "15%" }}>
                    <ProfilePicture user={follow??{}} size={50} />
                </TouchableOpacity>
                <View style={{ width: "60%", overflow: "hidden" }}>
                    {follow &&
                        <View style={{ width: "100%" }}>
                            <Text style={styles.profileName}>
                                {getUserName(follow, 24)}
                            </Text>
                        </View>
                    }
                    <View style={{ width: "100%" }}>
                        <Text style={styles.message}>
                            {getClipedContent(eventRef.current.content.replaceAll("\n", " "), 26)}
                        </Text>
                    </View>
                </View>                    
                <View style={{ width: "25%", overflow: "hidden", flexDirection: "row-reverse" }}>
                    <Text style={styles.dateMessage}>
                        {new Date((eventRef.current.created_at ?? 1) * 1000).toDateString()}
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
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    chatContainer: { width: "100%", padding: 10, marginVertical: 2 },
    chatRow: { paddingVertical: 5, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, paddingTop: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 16, right: 14, borderRadius: 4, 
        backgroundColor: theme.colors.red, padding: 2, minWidth: 18, alignItems: "center" }
})

export default memo(ListItemChat, (prev, next) => {
    return prev.item.chat_id == next.item.chat_id 
})

