import { useInitialize } from "./use-initialize"
import { DBEvents } from "@services/memory/database/events"
import { userService } from "@services/user"
import { getNotificationPermission } from "@services/permissions"
import { getEvent } from "@services/nostr/events"
import { getNostrInstance, subscribeUser } from "@services/nostr/pool"
import { messageService } from "@services/message"
import { User } from "@services/memory/types"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { renderHook, act } from "@testing-library/react-native"

jest.mock("@services/memory/database/events", () => ({
    DBEvents: { initDatabase: jest.fn() }
}))

jest.mock("@services/permissions", () => ({
    getNotificationPermission: jest.fn()
}))

jest.mock("@services/nostr/events", () => ({
    getEvent: jest.fn()
}))

jest.mock("@services/nostr/pool", () => ({
    getNostrInstance: jest.fn(),
    subscribeUser: jest.fn()
}))

describe("useInitialize", () => {
    const navigation = { reset: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should initialize and handle login success", async () => {
        const fakeUser = { pubkey: "123", name: "fake" } as User
        const fakeEvent = { kind: 3, content: "fake event" } as NDKEvent

        ;(DBEvents.initDatabase as jest.Mock).mockResolvedValue(undefined)
        ;(getNostrInstance as jest.Mock).mockResolvedValue("mockNDK")
        ;(getNotificationPermission as jest.Mock).mockResolvedValue(undefined)
        ;(userService.isLogged as jest.Mock).mockResolvedValue({ success: true, data: fakeUser })
        ;(messageService.listChats as jest.Mock).mockResolvedValue(["chat1"])
        ;(getEvent as jest.Mock).mockResolvedValue(fakeEvent)

        const { result } = renderHook(() => useInitialize({ navigation }))

        await act(async () => {
            jest.runAllTimers()
        })

        expect(DBEvents.initDatabase).toHaveBeenCalled()
        expect(getNostrInstance).toHaveBeenCalled()
        expect(getNotificationPermission).toHaveBeenCalled()
        expect(userService.isLogged).toHaveBeenCalled()
        expect(messageService.listChats).toHaveBeenCalledWith(fakeUser)
        expect(subscribeUser).toHaveBeenCalledWith(fakeUser)
        expect(getEvent).toHaveBeenCalledWith({
            kinds: [3],
            authors: ["123"],
            limit: 1
        })
        expect(navigation.reset).toHaveBeenCalledWith({
            index: 0,
            routes: [{ name: "authenticate-stack" }]
        })
        expect(result.current.loading).toBe(false)
    })

    it("should not reset navigation if user is not logged in", async () => {
        ;(DBEvents.initDatabase as jest.Mock).mockResolvedValue(undefined)
        ;(getNostrInstance as jest.Mock).mockResolvedValue("mockNDK")
        ;(getNotificationPermission as jest.Mock).mockResolvedValue(undefined)
        ;(userService.isLogged as jest.Mock).mockResolvedValue({ success: false })

        const { result } = renderHook(() => useInitialize({ navigation }))

        await act(async () => {
            jest.runAllTimers()
        })

        expect(navigation.reset).not.toHaveBeenCalled()
        expect(result.current.loading).toBe(false)
    })

    it("should set loading to false even if an exception occurs", async () => {
        ;(DBEvents.initDatabase as jest.Mock).mockRejectedValue(new Error("fail"))

        const { result } = renderHook(() => useInitialize({ navigation }))

        await act(async () => {
            jest.runAllTimers()
        })

        expect(result.current.loading).toBe(false)
    })
})
