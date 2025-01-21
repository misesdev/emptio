import theme from "@src/theme"
import { StyleSheet, View, Text, Image } from "react-native"
import { FlatList, RefreshControl, TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { memo, useEffect, useState } from "react"
import { HeaderChats } from "./header"
import { User } from "@/src/services/memory/types"
import { userService } from "@/src/core/userManager"
import { NostrEvent } from "@/src/services/nostr/events"
import { SearchBox } from "@/src/components/form/SearchBox"
import { useTranslateService } from "@/src/providers/translateProvider"
import NDK, { NDKEvent, NostrEvent as NEvent } from "@nostr-dev-kit/ndk"
import { useNotificationBar } from "@/src/providers/notificationsProvider"

type UserChat = {
    user: User,
    lastMessage: NostrEvent
}

const ChatsScreen = ({ navigation }: any) => {
   
    const { messageState } = useNotificationBar()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState<UserChat[]>([])
    const [filteredChats, setFilteredChats] = useState<UserChat[]>()
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => { handleLoadChats() }, [messageState])

    const handleLoadChats = async () => {

        setLoading(true)
        
        userService.listChats().then(async (events) => {
            
            const users = await userService.listUsers(events.map(e => e.pubkey ?? ""))

            const messages = events.map((event) : UserChat => {
                return {
                    user: users.find(u => u.pubkey == event.pubkey) ?? {},
                    lastMessage: event
                }
            })

            setFilteredChats(messages)
            setChats(messages)

            setLoading(false)
        })
        .catch((ex) => { 
            setLoading(false)
        })
    }

    const handleSearch = (searchTerm: string) => {
        if(!searchTerm.replace(" ", "").length) {
            return setFilteredChats(chats)
        }
        const filtered = chats.filter(c => `${c.user.display_name ?? ""}${c.user.name ?? ""}`.toUpperCase()
            .includes(searchTerm.toUpperCase()))

        setFilteredChats(filtered)
        setSearchTerm(searchTerm)
    }

    const handleOpenChat = (chat: User) => {
        console.log(chat)
    }

    const EmptyComponent = () => {
        return (
            <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const ListItem = memo(({ item }: { item: UserChat }) => {

        const [message, setMessage] = useState("")
        const event = new NDKEvent(Nostr as NDK, item.lastMessage as NEvent)

        event.decrypt().then(() => {
            const message = event.content?.length > 30 ?
                `${event.content?.substring(0, 30)}..` : event.content
            setMessage(message)
        })

        return (
            <View style={{ width: "100%", paddingVertical: 3 }}>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={styles.chatRow}
                        onPress={() => handleOpenChat(item.user)}
                >
                    <View style={{ width: "15%" }}>
                        <View style={styles.profile}>
                            {item.user?.picture && <Image onError={() => { item.user.picture = "" }} source={{ uri: item.user?.picture }} style={{ flex: 1 }} />}
                            {!item.user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}
                        </View>
                    </View>
                    <View style={{ width: "60%", overflow: "hidden" }}>
                        <Text style={styles.profileName}>
                            {item.user?.display_name ?? item.user?.name}
                        </Text>
                        <Text style={styles.message}>
                            {message} 
                        </Text>
                    </View>                    
                    <View style={{ width: "25%", overflow: "hidden", flexDirection: "row-reverse" }}>
                        <Text style={styles.dateMessage}>
                            {new Date((item.lastMessage.created_at ?? 1) * 1000).toDateString()}
                        </Text>
                    </View>
                    { item.lastMessage.status == "new" &&
                        <View style={styles.notify}></View>
                    }
                </TouchableOpacity>
            </View>
        )
    })

    return (

        <View style={theme.styles.container}>

            <HeaderChats navigation={navigation} />

            <SearchBox delayTime={0} seachOnLenth={0} label={useTranslate("commons.search")} onSearch={handleSearch} />

            <FlatList
                data={filteredChats}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.lastMessage.id ?? ""}
                style={styles.chatsScroll}
                ListEmptyComponent={EmptyComponent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleLoadChats} />}
            />

            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={() => navigation.navigate("new-chat-stack")}>
                    <Ionicons name="pencil" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatsScroll: { flex: 1, padding: 10 },
    newChatButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 10, right: 0, width: 100, height: 70, justifyContent: "center", alignItems: "center" },

    chatRow: { minHeight: 75, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, padding: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 36, right: 14, borderRadius: 50, 
        backgroundColor: theme.colors.red, width: 12, height: 12 }
})

export default ChatsScreen
