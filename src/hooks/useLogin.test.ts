import { renderHook, act } from "@testing-library/react-native"
import { showMessage } from "@components/general/MessageBox"
import { pushMessage } from "@services/notification"
import Clipboard from "@react-native-clipboard/clipboard"
import useLogin from "./useLogin" 

jest.mock("@services/nostr", () => ({
    validatePrivateKey: jest.fn()
}))

jest.mock("@services/nostr/events", () => ({
    getEvent: jest.fn()
}))

jest.mock("@services/nostr/pool", () => ({
    subscribeUser: jest.fn()
}))

describe("useLogin", () => {
    const navigation = { reset: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should disable login button for invalid secret key", () => {
        ;(validatePrivateKey as jest.Mock).mockReturnValue(false)

        const { result } = renderHook(() => useLogin({ navigation }))

        act(() => {
            result.current.setSecretKey("invalid-key")
        })

        expect(result.current.secretKey).toBe("invalid-key")
        expect(result.current.disabled).toBe(true)
    })

    it("should enable login button for valid secret key", () => {
        ;(validatePrivateKey as jest.Mock).mockReturnValue(true)

        const { result } = renderHook(() => useLogin({ navigation }))

        act(() => {
            result.current.setSecretKey("validnsec")
        })

        expect(result.current.secretKey).toBe("validnsec")
        expect(result.current.disabled).toBe(false)
    })

    it("should show error message if secretKey is invalid on login", async () => {
        ;(validatePrivateKey as jest.Mock).mockReturnValue(false)

        const { result } = renderHook(() => useLogin({ navigation }))

        act(() => {
            result.current.setSecretKey("badkey")
        })

        await act(async () => {
            await result.current.login()
        })

        expect(showMessage).toHaveBeenCalledWith({
            message: "message.invalidkey",
            infolog: "badkey"
        })
    })

    it("should call pushMessage on login failure", async () => {
        ;(validatePrivateKey as jest.Mock).mockReturnValue(true)

        ;(authService.signIn as jest.Mock).mockResolvedValue({
            success: false,
            message: "user not found"
        })

        const { result } = renderHook(() => useLogin({ navigation }))

        act(() => {
            result.current.setSecretKey("validkey")
        })

        await act(async () => {
            await result.current.login()
        })

        expect(pushMessage).toHaveBeenCalledWith("user not found")
    })

    it("should complete login and navigate on success", async () => {
        ;(validatePrivateKey as jest.Mock).mockReturnValue(true)
        ;(authService.signIn as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                pubkey: "abc",
                secretKey: "secret",
            }
        })
        ;(getEvent as jest.Mock).mockResolvedValue({ id: "event1" })

        const { result } = renderHook(() => useLogin({ navigation }))

        act(() => {
            result.current.setSecretKey("validkey")
        })

        await act(async () => {
            await result.current.onLogin()
        })

        expect(subscribeUser).toHaveBeenCalled()
        expect(getEvent).toHaveBeenCalled()
        expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: "core-stack" }] })
    })

    it("should read and handle clipboard if key is valid", async () => {
        ;(Clipboard.getString as jest.Mock).mockResolvedValue("valid-clipboard-key")
        ;(validatePrivateKey as jest.Mock).mockReturnValue(true)

        const { result } = renderHook(() => useLogin({ navigation }))

        await act(async () => {
            await result.current.login() // Força o useEffect a disparar depois de hook init
        })

        expect(showMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "commons.detectedkey",
                message: "message.detectedkey"
            })
        )
    })
})

