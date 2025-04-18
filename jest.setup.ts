import "@testing-library/jest-native/extend-expect"
import "react-native-gesture-handler/jestSetup"

// Avoid time warnings 
jest.useFakeTimers()

// Clipboard mock exemple
jest.mock("@react-native-clipboard/clipboard", () => ({
  getString: jest.fn(),
  setString: jest.fn(),
}))

jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native")
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            reset: jest.fn(),
        }),
    }
})

jest.mock("react-native", () => ({
    AppState: {
        addEventListener: jest.fn(() => ({
            remove: jest.fn()
        }))
    },
    StyleSheet: {
        create: jest.fn()
    }
}))

jest.mock("react-native-encrypted-storage", () => ({
    EncryptedStorage: {
        setItem: jest.fn(),
        getItem: jest.fn()
    } 
}))

jest.mock("@services/user", () => ({
    userService: {
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        isLogged: jest.fn(),
        searchUsers: jest.fn(),
    },
    createFollowEvent: jest.fn(),
}))

jest.mock("@services/message", () => ({
    messageService: {
        listChats: jest.fn(),
        listMessages: jest.fn()
    }
}))

jest.mock("@services/wallet", () => ({
    walletService: {
        listTransactions: jest.fn(),
    }
}))

jest.mock("@services/memory", () => ({
    storageService: {
        wallets: {
            add: jest.fn(),
            get: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        },
        secrets: {
            getPairKey: jest.fn(),
        },
    }
}))

jest.mock("@services/zustand/ndk", () => ({
    __esModule: true,
    default: () => ({
        setNDK: jest.fn(),
        setNdkSigner: jest.fn(),
        ndk: {
            pool: {
                relays: new Map([
                    ['r1', { connected: true }],
                    ['r2', { connected: false }],
                    ['r3', { connected: true }],
                ]),
            },
        },
    }),
}))

jest.mock("@services/zustand/chats", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        setChats: jest.fn(),
        addChat: jest.fn(),
        removeChat: jest.fn(),
        markAllRead: jest.fn(),
        markReadChat: jest.fn(),
        toggleSelectionMode: jest.fn(),
    }))
}))

jest.mock("@services/zustand/feedVideos", () => ({
    __esModule: true,
    useFeedVideosStore: () => ({
        initialize: jest.fn(),
        setFeedSettings: jest.fn(),
        addOnBlackList: jest.fn()
    })
}))

jest.mock("@components/general/MessageBox", () => ({
    showMessage: jest.fn()
}))

jest.mock("@services/notification", () => ({
    pushMessage: jest.fn()
}))

jest.mock("@src/providers/translateProvider", () => ({
    useTranslateService: () => ({
        useTranslate: (key: string) => key
    })
}))

jest.mock("@src/providers/userProvider", () => ({
    useAuth: () => ({
        user: {},
        setUser: jest.fn(),
        wallets: [],
        setWallets: jest.fn(),
        follows: [],
        setFollows: jest.fn(),
        followsEvent: {},
        setFollowsEvent: jest.fn()
    })
}))
