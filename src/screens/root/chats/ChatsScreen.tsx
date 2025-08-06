import theme from "@src/theme"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { useTranslateService } from "@src/providers/TranslateProvider"
import Ionicons from 'react-native-vector-icons/Ionicons'
import HeaderChats from "./header/HeaderChats"
import { SearchBox } from "@components/form/SearchBox"
import { StackScreenProps } from "@react-navigation/stack"
import ChatFilters from "./commons/ChatFilters"
import ChatList from "./commons/ChatList"
import ChatGroupAction from "./commons/ChatGroupAction"
import MessageBox from "@components/general/MessageBox"
import ProfileView from "./commons/ProfileView"
import useChatScreen from "./hooks/useChatScreen"

const ChatsScreen = ({ navigation }: StackScreenProps<any>) => {
   
    const { useTranslate } = useTranslateService()
    const { 
        user, listRef, selectionMode, selectedItems, filteredChats, filterChatsUsers,
        handleFilter, filterSection, handleSearch, showProfile, handleFriend,
        handleOpenChat, handleGroupAction
    } = useChatScreen({ navigation }) 

    return (
        <View style={theme.styles.container}>
            <HeaderChats navigation={navigation} />
            {!selectionMode &&
                <SearchBox delayTime={200} seachOnLenth={0}
                    label={useTranslate("commons.search")} onSearch={handleSearch} 
                />
            }
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
                <TouchableOpacity activeOpacity={.7} style={styles.newChatButton} onPress={() => navigation.navigate("new-chat")}>
                    <Ionicons name="pencil" size={theme.icons.medium} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
            <MessageBox />
            <ProfileView onHandleFriend={handleFriend} />
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
