import theme from "@src/theme"
import { ScrollView, StyleSheet, View, Text, Image } from "react-native"
import { FlatList, RefreshControl, TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { memo, useEffect, useState } from "react"
import { HeaderChats } from "./header"
import { useAuth } from "@/src/providers/userProvider"
import { User } from "@/src/services/memory/types"
import { userService } from "@/src/core/userManager"
import { NostrEvent } from "@nostr-dev-kit/ndk"
import { SearchBox } from "@/src/components/form/SearchBox"
import { useTranslateService } from "@/src/providers/translateProvider"

type UserChat = {
    user: User,
    messages: NostrEvent[]
}

const ChatsScreen = ({ navigation }: any) => {
    
    const { user, followsEvent } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState<UserChat[]>([])
    const [filteredChats, setFilteredChats] = useState<UserChat[]>()
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => { handleLoadChats() }, [])

    const handleLoadChats = async () => {

        setLoading(true)

        const friends: User[] = await userService.listFollows(user, followsEvent as NostrEvent, true)

        const events: NostrEvent[] = await userService.listChats(followsEvent as NostrEvent)

        const chats: UserChat[] = friends.filter(u => events.filter(e => e.pubkey == u.pubkey).length > 0)
        .map((friend): UserChat => {
            return {
                user: friend,
                messages: events.filter(e => e.pubkey == user.pubkey)
            }
        })

        setFilteredChats(chats)
        setChats(chats)

        setLoading(false)
    }

    const handleSearch = (searchTerm: string) => {
        if(!searchTerm.replace(" ", "").length) {
            return setFilteredChats(chats)
        }
        const filtered = chats.filter(c => c.user.display_name?.toUpperCase().includes(searchTerm.toUpperCase()))
        setFilteredChats(filtered)
        setSearchTerm(searchTerm)
    }

    const handleOpenChat = (chat: UserChat) => {
        console.log(chat)
    }

    const ListItem = memo(({ item }: { item: UserChat }) => {
        return (
            <View style={{ width: "100%", paddingVertical: 3 }}>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={styles.chatRow}
                        onPress={() => handleOpenChat(item)}
                >
                    <View style={{ width: "15%" }}>
                        <View style={styles.profile}>
                            {item.user?.picture && <Image onError={() => { item.user.picture = "" }} source={{ uri: item.user?.picture }} style={{ flex: 1 }} />}
                            {!item.user?.picture && <Image source={require("assets/images/defaultProfile.png")} style={{ width: 50, height: 50 }} />}
                        </View>
                    </View>
                    <View style={{ width: "60%", overflow: "hidden" }}>
                        <Text style={styles.profileName}>
                            {item.user.display_name ?? item.user.name}
                        </Text>
                    </View>                    
                    <View style={{ width: "25%", overflow: "hidden" }}>
                        
                    </View>
                </TouchableOpacity>
            </View>
        )
    })

    return (

        <View style={theme.styles.container}>

            <HeaderChats navigation={navigation} />

            <SearchBox label={useTranslate("commons.search")} onSearch={handleSearch} />

            <FlatList
                data={filteredChats}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.user.pubkey ?? ""}
                style={styles.chatsScroll}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleLoadChats} />}
            />

            { !loading && !filteredChats?.length && 
                <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                    {useTranslate("chat.empty")}
                </Text> 
            }

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
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 }
})

export default ChatsScreen
