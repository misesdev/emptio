
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
        addEventListener: jest.fn()
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
        signOut: jest.fn(),
        isLogged: jest.fn(),
    }
}))

jest.mock("@services/message", () => ({
    messageService: {
        listChats: jest.fn(),
        listMessages: jest.fn()
    }
}))

jest.mock("@services/wallet", () => ({
    walletService: {
        listTransactions: jest.fn()
    }
}))

jest.mock("@services/memory", () => ({
    storageService: {
        wallets: {
            add: jest.fn(),
            get: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }
    }
}))


