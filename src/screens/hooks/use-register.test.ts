import { renderHook, act } from "@testing-library/react-native"
import { useRegister } from "./use-register"
import { useAuth } from "@src/providers/userProvider"
import { userService, createFollowEvent } from "@services/user"
import { storageService } from "@services/memory"
import { subscribeUser, pushUserFollows } from "@services/nostr/pool"
import { pushMessage } from "@services/notification"
import { getUserName } from "@src/utils"

jest.mock("@services/nostr/pool", () => ({
    subscribeUser: jest.fn(),
    pushUserFollows: jest.fn(),
}))

jest.mock("@src/utils", () => ({
    getUserName: jest.fn(),
}))

describe("useRegister", () => {
    const mockSetUser = jest.fn()
    const mockSetFollowsEvent = jest.fn()
    const navigation = { reset: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should initialize with correct default state", () => {
        const { result } = renderHook(() => useRegister({ navigation }))
        expect(result.current.userName).toBe("")
        expect(result.current.loading).toBe(false)
        expect(result.current.disabled).toBe(true)
    })

    it("should enable register button when username is valid", () => {
        const { result } = renderHook(() => useRegister({ navigation }))

        act(() => {
            result.current.setUserName("john")
        })

        expect(result.current.disabled).toBe(false)
        expect(result.current.userName).toBe("john")
    })

    it("should prevent registration if username already exists", async () => {
        const { result } = renderHook(() => useRegister({ navigation }))

        const existingUser = { name: "john" }
        ;(userService.searchUsers as jest.Mock).mockResolvedValue([existingUser])
        ;(getUserName as jest.Mock).mockReturnValue("john")

        act(() => {
            result.current.setUserName("john")
        })

        await act(async () => {
            await result.current.register()
        })

        expect(pushMessage).toHaveBeenCalledWith("register.already_exists john")
        expect(result.current.loading).toBe(false)
        expect(result.current.disabled).toBe(false)
    })

    it("should register user and push follow event", async () => {
        
        // ;(useAuth as jest.Mock).mockReturnValue({
        //     setUser: mockSetUser,
        //     setFollowsEvent: mockSetFollowsEvent,
        // })
        
        const newUser = {
            pubkey: "pubkey123",
            keychanges: "key123",
        }

        ;(userService.searchUsers as jest.Mock).mockResolvedValue([])
        ;(userService.signUp as jest.Mock).mockResolvedValue({
            success: true,
            data: newUser,
        })

        ;(storageService.secrets.getPairKey as jest.Mock).mockResolvedValue("pairKey")
        ;(createFollowEvent as jest.Mock).mockReturnValue("followsEvent")

        const { result } = renderHook(() => useRegister({ navigation }))
        
        act(() => {
            result.current.setUserName("newuser")
        })

        await act(async () => {
            await result.current.register()
        })

        // expect(userService.signUp).toHaveBeenCalledWith({
        //     userName: "newuser",
        //     setUser: mockSetUser,
        // })

        expect(subscribeUser).toHaveBeenCalledWith(newUser)
        expect(storageService.secrets.getPairKey).toHaveBeenCalledWith("key123")
        expect(pushUserFollows).toHaveBeenCalledWith("followsEvent", "pairKey")
        //expect(mockSetFollowsEvent).toHaveBeenCalledWith("followsEvent")
        expect(navigation.reset).toHaveBeenCalledWith({
            index: 0,
            routes: [{ name: "core-stack" }],
        })
    })

    it("should show error if signUp fails", async () => {
        const { result } = renderHook(() => useRegister({ navigation }))

        ;(userService.searchUsers as jest.Mock).mockResolvedValue([])
        ;(userService.signUp as jest.Mock).mockResolvedValue({
            success: false,
            message: "server error",
        })

        act(() => {
            result.current.setUserName("erroruser")
        })

        await act(async () => {
            await result.current.register()
        })

        expect(pushMessage).toHaveBeenCalledWith("message.request.error server error")
    })

    it("should disable register button if username is too short", () => {
        const { result } = renderHook(() => useRegister({ navigation }))

        act(() => {
            result.current.setUserName("ab") // menor que 3 caracteres
        })

        expect(result.current.disabled).toBe(true)
        expect(result.current.userName).toBe("ab")
    })

    it("should show error if getPairKey fails", async () => {
        const newUser = { pubkey: "pubkey123", keychanges: "key123" }

        ;(userService.searchUsers as jest.Mock).mockResolvedValue([])
        ;(userService.signUp as jest.Mock).mockResolvedValue({
            success: true,
            data: newUser,
        })

        ;(storageService.secrets.getPairKey as jest.Mock).mockRejectedValue(new Error("getPairKey failed"))
        
        const { result } = renderHook(() => useRegister({ navigation }))

        act(() => {
            result.current.setUserName("failkey")
        })

        await act(async () => {
            await result.current.register()
        })

        expect(pushMessage).toHaveBeenCalledWith("message.request.error getPairKey failed")
    })

    it("should show error if pushUserFollows fails", async () => {
        const { result } = renderHook(() => useRegister({ navigation }))

        const newUser = {
            pubkey: "pubkey123",
            keychanges: "key123",
        }

        ;(userService.searchUsers as jest.Mock).mockResolvedValue([])
        ;(userService.signUp as jest.Mock).mockResolvedValue({
            success: true,
            data: newUser,
        })

        ;(storageService.secrets.getPairKey as jest.Mock).mockResolvedValue("pairKey")
        ;(createFollowEvent as jest.Mock).mockReturnValue("followsEvent")
        ;(pushUserFollows as jest.Mock).mockRejectedValue(new Error("pushUserFollows failed"))

        act(() => {
            result.current.setUserName("failpush")
        })

        await act(async () => {
            await result.current.register()
        })

        expect(pushMessage).toHaveBeenCalledWith("message.request.error pushUserFollows failed")
    })
})
