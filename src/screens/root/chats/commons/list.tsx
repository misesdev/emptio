import { User } from "@services/memory/types"
import { StyleSheet, Text, FlatList } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { ChatUser } from "@services/zustand/chats"
import { RefObject, useCallback, useMemo } from "react"
import theme from "@src/theme"
import { MutableRefObject } from "react"
import ListItemChat from "./listItem"

export type FilterChat = { 
    user_name: string, 
    chat_id: string,
    is_friend: boolean,
    profile: User 
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
        return <ListItemChat 
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
