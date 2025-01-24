import { NDKEvent } from "@nostr-dev-kit/ndk"
import { create } from "zustand"

export interface ChatUser {
    chat_id: string,
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
        set((state) => {
            return {
                unreadChats: [newer.chat_id, ...state.unreadChats.filter(c => c != newer.chat_id)],
                chats: [newer, ...state.chats.filter(c => c.chat_id != newer.chat_id)]
            }                       
        })
    },
    markAllRead: () => {
        set(() => ({
            unreadChats: []
        }))
    },
    markReadChat: (chat_id: string) => {
        set(state => ({
            unreadChats: state.unreadChats.filter(c => chat_id != chat_id)
        }))
    },
    setChats: (chats: ChatUser[]) => {
        set(()  => ({
            chats: chats
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


