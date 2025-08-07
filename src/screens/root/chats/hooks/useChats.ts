import { useCallback, useEffect, useRef, useState } from "react"
import { BackHandler, FlatList } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { showMessage } from "@components/general/MessageBox"
import { useAccount } from "@/src/context/AccountContext"
import useChatStore, { ChatUser } from "@/src/services/zustand/useChatStore"
import { useTranslateService } from "@/src/providers/TranslateProvider"
import { useService } from "@/src/providers/ServiceProvider"
import { ChatFilterType } from "../commons/ChatFilters"
import { ChatActionType } from "../commons/ChatGroupAction"
import { ShowProfileView } from "../commons/ProfileView"
import { User } from "@services/user/types/User"
import { FilterChat } from "../commons/ChatList"

const useChats = ({ navigation }: any) => {
    const timeout = useRef<any>(null)
    const listRef = useRef<FlatList>(null)
    const { user, followsEvent } = useAccount()
    const { 
        chats, markReadChat, setChats, selectionMode, toggleSelectionMode, removeChat 
    } = useChatStore()
    const { messageService } = useService()
    const { useTranslate } = useTranslateService()
    const selectedItems = useRef<Set<ChatUser>>(new Set<ChatUser>())
    const filterChatsUsers = useRef<FilterChat[]>([])
    const [filteredChats, setFilteredChats] = useState(chats)
    const [filterSection, setFilterSection] = useState<ChatFilterType>("all")

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

        if(!cleanSearchTerm.length) 
            return handleFilter(filterSection)

        const chat_ids = filterChatsUsers.current
            .filter(f => filteredChats.map(c => c.chat_id).includes(f.chat_id))
            .filter(f => f.user_name.toLowerCase().includes(cleanSearchTerm))
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
        navigation.navigate("conversation", { chat_id, follow })
    }, [navigation])

    const showProfile = useCallback((profile: User) => {
        ShowProfileView({ profile })
    }, [ShowProfileView])

    const handleFriend = useCallback((profile: User, isFriend: boolean) => {
        filterChatsUsers.current.forEach(item => {
            if(item.profile.pubkey == profile.pubkey) item.is_friend = isFriend
        })
        handleFilter(filterSection)
    }, [filterChatsUsers, handleFilter, filterSection])
    
    return {
        user,
        listRef,
        selectionMode,
        selectedItems,
        filteredChats,
        filterChatsUsers,
        filterSection,
        handleFilter,
        handleSearch,
        showProfile,
        handleFriend,
        handleOpenChat,
        handleGroupAction
    }
}

export default useChats
