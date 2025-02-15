import { User } from "@services/memory/types"
import { StyleSheet, Text, FlatList } from "react-native"
import { useTranslateService } from "@src/providers/translateProvider"
import { ChatUser } from "@services/zustand/chats"
import { RefObject, useCallback } from "react"
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
    selectedItems: MutableRefObject<ChatUser[]>,
    selectionMode: MutableRefObject<boolean>,
    handleOpenChat: (chat_id: string, user: User) => void
}

const ChatList = ({ user, chats, listRef, filters, selectionMode, selectedItems, handleOpenChat }: Props) => {
  
    const { useTranslate } = useTranslateService()

    const EmptyComponent = () => {
        return (
            <Text style={{ color: theme.colors.gray, marginTop: 200, textAlign: "center" }}>
                {useTranslate("chat.empty")}
            </Text>
        )
    }

    const renderItem = useCallback(({ item }: { item: ChatUser }) => {
        return <ListItemChat 
            item={item} user={user} filters={filters} handleOpenChat={handleOpenChat}
            selectedItems={selectedItems} selectionMode={selectionMode}
        />
    }, [user, filters, handleOpenChat, selectionMode, selectedItems])

    return (
        <FlatList ref={listRef}
            data={chats}
            extraData={selectionMode}
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
})

export default ChatList
