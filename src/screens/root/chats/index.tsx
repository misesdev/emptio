import theme from "@src/theme"
import { StyleSheet, View, TouchableOpacity, FlatList, BackHandler } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useCallback, useEffect, useRef, useState } from "react"
import { HeaderChats } from "./header"
import { SearchBox } from "@components/form/SearchBox"
import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/providers/userProvider"
import useChatStore, { ChatUser } from "@services/zustand/chats"
import { User } from "@services/memory/types"
import { StackScreenProps } from "@react-navigation/stack"
import ChatFilters, { ChatFilterType } from "./commons/filters"
import ChatList, { FilterChat } from "./commons/list"
import ChatGroupAction, { ChatActionType } from "./commons/options"
import { messageService } from "@/src/core/messageManager"
import MessageBox, { showMessage } from "@/src/components/general/MessageBox"
import { useFocusEffect } from "@react-navigation/native"
import ProfileView, { ShowProfileView } from "./commons/profile"

const ChatsScreen = ({ navigation }: StackScreenProps<any>) => {
   
    const timeout = useRef<any>(null)
    const listRef = useRef<FlatList>(null)
    const { user, followsEvent } = useAuth()
    const { chats, markReadChat, setChats } = useChatStore()
    const { useTranslate } = useTranslateService()
    const selectedItems = useRef<Set<ChatUser>>(new Set<ChatUser>())
    const filterChatsUsers = useRef<FilterChat[]>([])
    const [filteredChats, setFilteredChats] = useState(chats)
    const [filterSection, setFilterSection] = useState<ChatFilterType>("all")
    const { selectionMode, toggleSelectionMode, removeChat } = useChatStore()

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
        }, [selectionMode, selectedItems])
    )

    useEffect(() => {
        if(filterChatsUsers.current.length) {
            if(timeout.current) clearTimeout(timeout.current)
            timeout.current = setTimeout(() => handleFilter(filterSection), 10)
        }
    }, [chats, followsEvent])

    const handleSearch = (searchTerm: string) => {
      
        const cleanSearchTerm = searchTerm.trim().toLowerCase()

        if(!cleanSearchTerm.length) return setFilteredChats(chats)

        const chat_ids = filterChatsUsers.current.filter(f => 
            f.user_name.toLowerCase().includes(cleanSearchTerm))
            .map(f => f.chat_id)

        setFilteredChats(chats.filter(c => chat_ids.includes(c.chat_id)))
    }

    const handleFilter = useCallback((section: ChatFilterType) => {
       
        setFilterSection(section)
        
        if(section == "all") setFilteredChats(chats)
        
        if(section == "unread") {
            const unreads = chats.filter(c => (c.unreadCount??0) > 0).map(c => c.chat_id)
            setFilteredChats(chats.filter(c => unreads.includes(c.chat_id)))
        }
        if(section == "friends") {
            const friends = filterChatsUsers.current.filter(c => c.is_friend).map(c => c.chat_id)
            setFilteredChats(chats.filter(c => friends.includes(c.chat_id)))
        }
        if(section == "unknown") {
            const friends = filterChatsUsers.current.filter(c => !c.is_friend).map(c => c.chat_id)
            setFilteredChats(chats.filter(c => friends.includes(c.chat_id)))
        }

    }, [chats, filterChatsUsers])

    const handleGroupAction = useCallback((action: ChatActionType) => {
        if(action == "cancel") { 
            toggleSelectionMode(false)
            selectedItems.current.clear()
        }
        if(action == "markread") {
            selectedItems.current.forEach(chat => {
                markReadChat(chat.chat_id)
            })
            toggleSelectionMode(false)
            selectedItems.current.clear()
        }
        if(action == "delete") {
            showMessage({
                title: useTranslate("chat.labels.delete-conversations"),
                message: useTranslate("message.chats.alertdelete"),
                action: {
                    label: useTranslate("commons.delete"),
                    onPress: () => {
                        toggleSelectionMode(false)
                        const chat_ids = [...selectedItems.current].map(c => c.chat_id)
                        setTimeout(async () => await messageService.deleteChats(chat_ids), 20)
                        chat_ids.forEach(removeChat)
                        selectedItems.current.clear()
                    }
                }
            })
        }
    }, [selectedItems, markReadChat, setChats, useTranslate])

    const handleOpenChat = useCallback((chat_id: string, follow: User) => {
        navigation.navigate("conversation-chat-stack", { chat_id, follow })
    }, [navigation])

    const showProfile = useCallback((profile: User) => {
        ShowProfileView({ profile })
    }, [ShowProfileView])

    return (
        <View style={theme.styles.container}>
            <HeaderChats navigation={navigation} />
            <SearchBox delayTime={200} seachOnLenth={0}
                label={useTranslate("commons.search")} onSearch={handleSearch} 
            />
            {!selectionMode &&
                <ChatFilters onFilter={handleFilter} activeSection={filterSection} />
            }
            {selectionMode &&
                <ChatGroupAction onAction={handleGroupAction} />
            }

            <ChatList chats={filteredChats} user={user} listRef={listRef}
                filters={filterChatsUsers.current} handleOpenChat={handleOpenChat}
                selectedItems={selectedItems} showProfile={showProfile} 
            />

            <View style={styles.rightButton}>
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={() => navigation.navigate("new-chat-stack")}>
                    <Ionicons name="pencil" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
            <MessageBox />
            <ProfileView />
        </View>
    )
}

const styles = StyleSheet.create({
    chatsScroll: { flex: 1, paddingVertical: 10 },
    newChatButton: { backgroundColor: theme.colors.blue, padding: 18, borderRadius: 50 },
    rightButton: { position: "absolute", bottom: 8, right: 0, width: 90, height: 70, justifyContent: "center", alignItems: "center" },

    chatRow: { minHeight: 75, flexDirection: "row" },
    profile: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
    profileName: { fontSize: 16, fontWeight: "500", color: theme.colors.white, paddingHorizontal: 5 },
    message: { color: theme.colors.gray, padding: 2 },
    dateMessage: { color: theme.colors.white, fontSize: 11, fontWeight: "500" },
    notify: { position: "absolute", bottom: 36, right: 14, borderRadius: 50, 
        backgroundColor: theme.colors.red, width: 12, height: 12 }
})

export default ChatsScreen
