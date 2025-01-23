import { User } from "@/src/services/memory/types"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native"
import { useTranslateService } from "@/src/providers/translateProvider"
import { NostrEvent } from "@/src/services/nostr/events"
import { memo, useState } from "react"
import NDK, { NDKEvent, NostrEvent as NEvent } from "@nostr-dev-kit/ndk"
import theme from "@/src/theme"

export type UserChat = {
    user: User,
    lastMessage: NostrEvent
}

type Props = {
    user: User, 
    chats: UserChat[],
    loading: boolean,
    handleLoadChats: () => void,
    handleOpenChat: (userChat: UserChat) => void
}

const ChatList = ({ user, chats, loading, handleLoadChats, handleOpenChat }: Props) => {
   
    const { useTranslate } = useTranslateService()

    const EmptyComponent = () => {
        return (
            <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const ListItem = memo(({ item }: { item: UserChat }) => {

        const [status, setStatus] = useState(item.lastMessage.status)
        //const [event, setEvent] = useState(new NDKEvent(Nostr as NDK, item.lastMessage as NEvent))

        // if(event.pubkey != user.pubkey) {
        //     event.decrypt().then(() => {
        //         setEvent({...event} as NDKEvent) 
        //     })
        // }

        const handleClichUser = () => {
            if(status == "new") setStatus("viewed")
            handleOpenChat(item)
        }
    
        const getUserName = () : string => {
            var userName = item.user.display_name ?? item.user.name ?? ""

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
                    onPress={handleClichUser}
                >
                    <View style={{ width: "15%" }}>
                        <View style={styles.profile}>
                            {item.user?.picture && <Image onError={() => { item.user.picture = "" }} source={{ uri: item.user?.picture }} style={{ flex: 1 }} />}
                            {!item.user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}
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
                    { status == "new" &&
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
            refreshControl={<RefreshControl refreshing={loading} onRefresh={handleLoadChats} />}
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
