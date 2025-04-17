import "@testing-library/jest-native/extend-expect"
import "react-native-gesture-handler/jestSetup"

// Evita warnings de timers
jest.useFakeTimers()

// Clipboard mock de exemplo
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
        setNdkSigner: jest.fn()
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
        setUser: jest.fn(),
        setFollowsEvent: jest.fn()
    })
}))
