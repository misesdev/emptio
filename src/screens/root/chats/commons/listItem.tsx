import { messageService } from "@/src/core/messageManager"
import { userService } from "@/src/core/userManager"
import { useAuth } from "@/src/providers/userProvider"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { User } from "@services/memory/types"
import { ChatUser } from "@services/zustand/chats"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { FilterChat } from "./list"
import { getUserName } from "@src/utils"
import { Vibration, View, Text, TouchableOpacity, 
    StyleSheet, Animated } from "react-native"
import theme from "@/src/theme"
import { ProfilePicture } from "@components/nostr/user/ProfilePicture"
// import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, 
//      useSharedValue } from "react-native-reanimated"

interface ListItemProps {
    user: User,
    item: ChatUser,
    filters: FilterChat[],
    selectionMode: MutableRefObject<boolean>,
    selectedItems: MutableRefObject<ChatUser[]>,
    handleOpenChat: (chat_id: string, user: User) => void
}

const ListItemChat = ({ item, user, filters,
    selectionMode, selectedItems, handleOpenChat }: ListItemProps) => {

    const { follows } = useAuth()
    const selected = useRef(0);
    const highlight = useRef(new Animated.Value(0)).current
    const [follow, setFollow] = useState<User|null>(null)
    const [event, setEvent] = useState<NDKEvent>(item.lastMessage)

    useEffect(() => { loadItemData() }, [])
    useEffect(() => {
        if(!selectionMode.current) highlight.setValue(0) 
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
        if(selectionMode.current) 
        {
            if(!selected.current) { 
                highlight.setValue(1)
                selectedItems.current = [...selectedItems.current, item] 
                selected.current = 1
            } else {
                highlight.setValue(0)
                selectedItems.current = [
                    ...selectedItems.current.filter(i => i.chat_id != item.chat_id)
                ]
                selected.current = 0
            }

            if(selectedItems.current.length === 0)
                selectionMode.current = false
        } 
        else if(follow) {
            handleOpenChat(item.chat_id, follow)
        }
    }

    const handleSelectionMode = () => {
        highlight.setValue(1)
        selected.current = 1
        selectionMode.current = true
        highlight.setValue(1)
        if (!selectedItems.current.includes(item)) {
            selectedItems.current = [...selectedItems.current, item]; // Evita modificar diretamente a ref
        }
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
                <TouchableOpacity style={{ width: "15%" }}>
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
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    chatContainer: { width: "100%", padding: 10, marginVertical: 2, borderRadius: 10 },
    chatRow: { paddingVertical: 5, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, paddingTop: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 16, right: 14, borderRadius: 4, 
        backgroundColor: theme.colors.red, padding: 2, minWidth: 18, alignItems: "center" }
})

export default ListItemChat

