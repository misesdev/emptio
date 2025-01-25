import theme from "@src/theme"
import { StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { HeaderChats } from "./header"
import { SearchBox } from "@/src/components/form/SearchBox"
import { useTranslateService } from "@/src/providers/translateProvider"
import { useAuth } from "@/src/providers/userProvider"
import ChatList from "./list"
import useChatStore, { ChatUser } from "@/src/services/zustand/chats"
import { User } from "@/src/services/memory/types"

const ChatsScreen = ({ navigation }: any) => {
   
    const { user } = useAuth()
    const { chats } = useChatStore()
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (searchTerm: string) => {
        // if(!searchTerm.replace(" ", "").length) {
        //     return setFilteredChats(chats)
        // }
        // const filtered = chats.filter(c => `${c.user.display_name ?? ""}${c.user.name ?? ""}`.toUpperCase()
        //     .includes(searchTerm.toUpperCase()))

        // setFilteredChats(filtered)
        // setSearchTerm(searchTerm)
    }

    const handleOpenChat = (chat_id: string, follow: User) => {
        navigation.navigate("conversation-chat-stack", { chat_id, follow })
    }

    return (

        <View style={theme.styles.container}>

            <HeaderChats navigation={navigation} />

            {/* <SearchBox delayTime={0} seachOnLenth={0} label={useTranslate("commons.search")} onSearch={handleSearch} /> */}

            {/* <ChatFilters onFilter={filterEvents} activeSection={activeSection} /> */}

            <ChatList chats={chats} user={user} handleOpenChat={handleOpenChat} />

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
