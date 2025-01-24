import { User } from "@/src/services/memory/types"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"
import useChatStore, { ChatUser } from "@/src/services/zustand/chats"
import { memo, useEffect, useState } from "react"
import NDK, { NDKEvent, NostrEvent as NEvent } from "@nostr-dev-kit/ndk"
import theme from "@/src/theme"
import { userService } from "@/src/core/userManager"

type Props = {
    user: User, 
    chats: ChatUser[],
    handleOpenChat: (chat_id: string, user: User) => void
}

const ChatList = ({ user, chats, handleOpenChat }: Props) => {
  
    const { useTranslate } = useTranslateService()
    const unreadChats = useChatStore(state => state.unreadChats)

    const EmptyComponent = () => {
        return (
            <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const ListItem = memo(({ item }: { item: ChatUser }) => {

        const [follow, setFollow] = useState<User>({})
        const [viewed, setViewed] = useState<boolean>(false)
        //const [event, setEvent] = useState(new NDKEvent(Nostr as NDK, item.lastMessage as NEvent))

        useEffect(() => { loadFollow() }, [])

        const loadFollow = async () => {
            const followData = await userService.getProfile(item.lastMessage.pubkey)
            setViewed(!!unreadChats.filter(c => c == item.chat_id).length)
            setFollow(followData)
        }
        // if(event.pubkey != user.pubkey) {
        //     event.decrypt().then(() => {
        //         setEvent({...event} as NDKEvent) 
        //     })
        // }
    
        const getUserName = () : string => {
            var userName = follow.display_name ?? follow.name ?? ""

            return userName.length > 20 ? `${userName?.substring(0,20)}..` : userName
        }

        const getMessage = () => {
            return item.lastMessage.content.length > 30 ? 
                `${item.lastMessage.content.substring(0,30)}..`: item.lastMessage.content
        }

        return (
            <View style={{ width: "100%", paddingVertical: 3 }}>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={styles.chatRow}
                    onPress={() => handleOpenChat(item.chat_id, follow)}
                >
                    <View style={{ width: "15%" }}>
                        <View style={styles.profile}>
                            {follow?.picture && <Image onError={() => { follow.picture = "" }} source={{ uri: follow.picture }} style={{ flex: 1 }} />}
                            {!follow?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}
                        </View>
                    </View>
                    <View style={{ width: "60%", overflow: "hidden" }}>
                        <Text style={styles.profileName}>
                            {getUserName()}
                        </Text>
                        <Text style={styles.message}>
                            {getMessage()} 
                        </Text>
                    </View>                    
                    <View style={{ width: "25%", overflow: "hidden", flexDirection: "row-reverse" }}>
                        <Text style={styles.dateMessage}>
                            {new Date((item.lastMessage.created_at ?? 1) * 1000).toDateString()}
                        </Text>
                    </View>
                    { viewed &&
                        <View style={styles.notify}></View>
                    }
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => <ListItem item={item} />}
            keyExtractor={(item) => item.lastMessage.id ?? ""}
            style={styles.chatsScroll}
            ListEmptyComponent={EmptyComponent}
        />
    )
}

const styles = StyleSheet.create({
    chatsScroll: { flex: 1, padding: 10 },
    chatRow: { minHeight: 75, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, padding: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 36, right: 14, borderRadius: 50, 
        backgroundColor: theme.colors.red, width: 12, height: 12 }
})

export default ChatList
