import { StyleSheet, Text, FlatList } from "react-native"
import { RefObject, useCallback, useMemo } from "react"
import { User } from "@services/user/types/User"
import { ChatUser } from "@services/zustand/useChatStore"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { MutableRefObject } from "react"
import ChatItem from "./ChatItem"
import theme from "@src/theme"

export type FilterChat = { 
    user_name: string;
    chat_id: string;
    is_friend: boolean;
    profile: User; 
}

type Props = {
    user: User, 
    chats?: ChatUser[],
    filters: FilterChat[],
    listRef: RefObject<FlatList>,
    selectedItems: MutableRefObject<Set<ChatUser>>,
    handleOpenChat: (chat_id: string, user: User) => void,
    showProfile: (profile: User) => void
}

const ChatList = ({ user, chats, listRef, filters,
    selectedItems, handleOpenChat, showProfile }: Props) => {
  
    const { useTranslate } = useTranslateService()
    const memorizedChats = useMemo(() => chats, [chats])

    const EmptyComponent = () => {
        return (
            <Text style={styles.empty}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const renderItem = useCallback(({ item }: { item: ChatUser }) => {
        return <ChatItem 
            item={item} user={user} filters={filters} handleOpenChat={handleOpenChat}
            selectedItems={selectedItems} showProfile={showProfile} 
        />
    }, [user, filters, handleOpenChat, selectedItems, showProfile])

    return (
        <FlatList ref={listRef}
            data={memorizedChats}
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
    empty: { color: theme.colors.gray, marginTop: 200, textAlign: "center" }
})

export default ChatList
