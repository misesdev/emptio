
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

