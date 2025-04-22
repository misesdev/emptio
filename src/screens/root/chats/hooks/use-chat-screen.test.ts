import { renderHook, act } from '@testing-library/react-native'
import useChatScreen from './use-chat-screen'
import { useAuth } from '@src/providers/userProvider'
import useChatStore, { ChatUser } from '@services/zustand/chats'
import { BackHandler } from 'react-native'
import { FilterChat } from '../commons/list'
import { ShowProfileView } from '../commons/profile'
import { showMessage } from '@components/general/MessageBox'

const mockNavigate = jest.fn()

jest.mock("../commons/profile", () => ({
    ShowProfileView: jest.fn()
}))

jest.mock('@src/providers/userProvider', () => ({
    useAuth: jest.fn(),
}))

jest.mock('@services/zustand/chats', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('useChatScreen', () => {
    const mockUser = { pubkey: 'user1' }
    const chat = {
        chat_id: '123',
        unreadCount: 1,
    } as ChatUser 

    const friendChat = {
        chat_id: '456',
        unreadCount: 0,
    } as ChatUser

    const setup = (overrideChats = [chat]) => {
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            followsEvent: [],
        })

        const toggleSelectionMode = jest.fn()
        const markReadChat = jest.fn()
        const removeChat = jest.fn()

        ;(useChatStore as jest.Mock).mockReturnValue({
            chats: overrideChats,
            selectionMode: false,
            toggleSelectionMode,
            markReadChat,
            removeChat,
            setChats: jest.fn(),
        })

        const { result } = renderHook(() =>
            useChatScreen({ navigation: { navigate: mockNavigate } })
        )

        return { result, toggleSelectionMode, markReadChat, removeChat }
    }

    it('should return filtered chats on search', () => {
        const { result } = setup([{ ...chat }])

        result.current.filterChatsUsers.current = [{ chat_id: '123', user_name: 'Alice' } as FilterChat]

        act(() => {
            result.current.handleSearch('Alice')
        })

        expect(result.current.filteredChats).toHaveLength(1)

        act(() => {
            result.current.handleSearch('Bob')
        })

        expect(result.current.filteredChats).toHaveLength(0)
    })

    it('should filter unread chats', () => {
        const { result } = setup([
            chat,
            { chat_id: '2', unreadCount: 0 } as ChatUser,
        ])

        act(() => {
            result.current.handleFilter('unread')
        })

        expect(result.current.filteredChats).toEqual([chat])
    })

    it('should filter friends', () => {
        const { result } = setup([friendChat])
        result.current.filterChatsUsers.current = [{ chat_id: '456', is_friend: true } as FilterChat]

        act(() => {
            result.current.handleFilter('friends')
        })

        expect(result.current.filteredChats.map(c => c.chat_id)).toEqual(['456'])
    })

    it('should filter unknown', () => {
        const { result } = setup([friendChat])
        result.current.filterChatsUsers.current = [{ chat_id: '456', is_friend: false } as FilterChat]

        act(() => {
            result.current.handleFilter('unknown')
        })

        expect(result.current.filteredChats.map(c => c.chat_id)).toEqual(['456'])
    })

    it('should handle cancel group action', () => {
        const { result, toggleSelectionMode } = setup()

        result.current.selectedItems.current.add(chat)

        act(() => {
            result.current.handleGroupAction('cancel')
        })

        expect(toggleSelectionMode).toHaveBeenCalledWith(false)
        expect(result.current.selectedItems.current.size).toBe(0)
    })

    it('should handle mark as read', () => {
        const { result, markReadChat, toggleSelectionMode } = setup()

        result.current.selectedItems.current.add(chat)

        act(() => {
            result.current.handleGroupAction('markread')
        })

        expect(markReadChat).toHaveBeenCalledWith('123')
        expect(toggleSelectionMode).toHaveBeenCalledWith(false)
        expect(result.current.selectedItems.current.size).toBe(0)
    })

    it('should handle delete chats', async () => {
        const { result, removeChat, toggleSelectionMode } = setup()

        result.current.selectedItems.current.add(chat)

        await act(async () => {
            result.current.handleGroupAction('delete')
        })

        expect(showMessage).toHaveBeenCalled()
        // expect(removeChat).toHaveBeenCalledWith('123')
        // expect(toggleSelectionMode).toHaveBeenCalledWith(false)
    })

    it('should navigate to conversation chat', () => {
        const { result } = setup()
        const follow = { pubkey: 'user1' }

        act(() => {
            result.current.handleOpenChat('123', follow)
        })

        expect(mockNavigate).toHaveBeenCalledWith('conversation-chat-stack', {
            chat_id: '123',
            follow,
        })
    })

    it('should show profile', () => {
        const { result } = setup()
        const profile = { pubkey: 'user1' }
        ;(ShowProfileView as jest.Mock)

        act(() => {
            result.current.showProfile(profile)
        })

        expect(ShowProfileView).toHaveBeenCalledWith({ profile })
    })

    it('should update is_friend in handleFriend', () => {
        const { result } = setup()

        result.current.filterChatsUsers.current = [
            { chat_id: '1', is_friend: false, profile: { pubkey: 'abc' } } as FilterChat,
        ]

        act(() => {
            result.current.handleFriend({ pubkey: 'abc' }, true)
        })

        expect(result.current.filterChatsUsers.current[0].is_friend).toBe(true)
    })

    // it('should handle back press when in selection mode', () => {
    //     const toggleSelectionMode = jest.fn()
    //     const chatStore = {
    //         chats: [chat],
    //         selectionMode: true,
    //         toggleSelectionMode,
    //         markReadChat: jest.fn(),
    //         removeChat: jest.fn(),
    //         setChats: jest.fn(),
    //     }
    //     ;(useChatStore as jest.Mock).mockReturnValue(chatStore)

    //     const backSpy = jest.spyOn(BackHandler, 'addEventListener')

    //     renderHook(() =>
    //         useChatScreen({ navigation: { navigate: mockNavigate } })
    //     )

    //     const callBack = backSpy.mock.calls[0][1]
    //     expect(callBack()).toBe(true)
    // })
})
