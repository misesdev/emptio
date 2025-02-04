import { NDKEvent } from "@nostr-dev-kit/ndk"
import { create } from "zustand"

export interface ChatUser {
    chat_id: string,
    unreadCount?: number,
    lastMessage: NDKEvent
}

interface ChatStore {
    chats: ChatUser[],
    unreadChats: string[],
    addChat: (chat: ChatUser) => void,
    removeChat: (chat_id: string) => void,
    markAllRead: () => void,
    markReadChat: (chat_id: string) => void,
    setChats: (chats: ChatUser[]) => void
}

const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    unreadChats: [],
    addChat: (newer: ChatUser) => {
        newer.unreadCount = 1
        set((state) => {
            if(state.unreadChats.includes(newer.chat_id))
            {
                return {
                    unreadChats: [newer.chat_id, ...state.unreadChats.filter(c => c != newer.chat_id)],
                    chats: state.chats.map(chat => {
                        if(chat.chat_id == newer.chat_id && chat.unreadCount) {
                            chat.unreadCount += 1
                            chat.lastMessage = newer.lastMessage
                        }
                        return chat
                    })
                }
            }
            
            return {
                unreadChats: [newer.chat_id, ...state.unreadChats.filter(c => c != newer.chat_id)],
                chats: [newer, ...state.chats.filter(c => c.chat_id != newer.chat_id)]
                    .sort((a,b) => (b.lastMessage.created_at??1) - (a.lastMessage.created_at??1))
            }                       
        })
    },
    markAllRead: () => {
        set((state) => ({
            unreadChats: [],
            chats: state.chats.map(chat => {
                chat.unreadCount = 0
                return chat
            })
        }))
    },
    markReadChat: (chat_id: string) => {
        set(state => ({
            unreadChats: state.unreadChats.filter(id => id != chat_id),
            chats: state.chats.map(chat => {
                if(chat.chat_id == chat_id) chat.unreadCount = 0
                return chat
            })
        }))
    },
    setChats: (chats: ChatUser[]) => {
        set(()  => ({
            chats: chats,
            unreadChats: chats.filter(c => !!c.unreadCount).map(c => c.chat_id)
        }))
    },
    removeChat: (chat_id: string) => {
        set((state) => ({
            unreadChats: state.unreadChats.filter(c => c != chat_id),
            chats: state.chats.filter(c => c.chat_id != chat_id)
        }))
    }
}))

export default useChatStore


