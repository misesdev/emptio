import AsyncStorage from "@react-native-async-storage/async-storage"
import { RelayStorage } from "./index"
import { DefaultRelays } from "../../../constants/Relays"

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}))

jest.mock("../../../constants/Relays", () => ({
    DefaultRelays: ["wss://default1.example", "wss://default2.example"]
}))

jest.mock("../../nostr/pool", () => ({
    searchRelays: jest.fn()
}))

describe("RelayStorage", () => {
    const defaultRelays = [...DefaultRelays]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("list", () => {
        it("should return relays from AsyncStorage when they exist", async () => {
            const storedRelays = ["wss://stored1.example", "wss://stored2.example"]
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedRelays))

            const result = await RelayStorage.list()

            expect(result).toEqual(storedRelays)
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("relays")
        })

        it("should return default relays if nothing is saved", async () => {
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)

            const result = await RelayStorage.list()

            expect(result).toEqual(defaultRelays)
        })
    })

    describe("add", () => {
        it("must add a new relay and save it to AsyncStorage", async () => {
            const existingRelays = ["wss://relay1.example"]
            const newRelay = "wss://relay2.example"
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existingRelays))

            await RelayStorage.add(newRelay)

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "relays",
                JSON.stringify([...existingRelays, newRelay])
            )
        })
    })

    describe("remove", () => {
        it("must remove an existing relay and save it to AsyncStorage", async () => {
            const relays = ["wss://relay1.example", "wss://relay2.example"]
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(relays))

            await RelayStorage.remove("wss://relay1.example")

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "relays",
                JSON.stringify(["wss://relay2.example"])
            )
        })

        it("should not change anything if relay does not exist", async () => {
            const relays = ["wss://relay1.example"]
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(relays))

            await RelayStorage.remove("wss://notfound.example")

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "relays",
                JSON.stringify(relays)
            )
        })
    })
})

